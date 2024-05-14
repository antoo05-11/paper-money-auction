import jwt from 'jsonwebtoken';
import {AuctionSession} from './auction_session/components/session';
import errorCode from '../constants/error.code';
import {Server} from 'socket.io';
import {Service} from './service';
import {Auction} from '../models/auction';
import NodeCache from 'node-cache';
import userRole from '../constants/user.role';

let instance;

class SocketService extends Service {
    #sessions = new NodeCache({stdTTL: 6 * 60 * 60, checkperiod: 120}); // Map socketId _ AuctionSession.
    #users = new Map(); // For tracking in_out only. Map socketId _ {sessionId, userId}.

    constructor() {
        super();
        if (instance) {
            throw new Error('Socket Service must be constructed only one time!');
        }
        instance = this;
    }

    init(httpServer) {
        super.init();

        this.io = new Server(httpServer, {
            path: '/socket/', cors: {
                origin: '*',
            }
        });

        this.io.on('connection', (socket) => {

            console.log(`Socket message: User ${socket.id} connected socket.`);

            socket.on('start_session', async (auctionToken) => this.#startSession(socket, auctionToken, [userRole.AUCTIONEER]))

            socket.on('join_session', (auctionToken) => this.#joinSession(socket, auctionToken, [userRole.AUCTIONEER, userRole.CUSTOMER, userRole.ASSET_OWNER]));

            socket.on('make_offer', (auctionToken, offer) => this.#makeOffer(socket, auctionToken, offer, [userRole.CUSTOMER]))

            socket.on('withdraw_offer', (auctionToken, offer) => this.#withdrawOffer(socket, auctionToken, offer, [userRole.CUSTOMER]))

            socket.on('disconnect', () => this.#disconnect(socket));
        });
    }

    #authSession = (socket, auctionToken, roles) => {
        const secretKey = process.env.JWT_AUCTION_KEY || '';
        try {
            const decoded = jwt.verify(auctionToken, secretKey);

            delete decoded.iat;
            delete decoded.exp;
            // decode: {userId, sessionId, role}
            if (decoded.userId && decoded.sessionId && decoded.role) {
                if (roles && !roles.includes(decoded.role)) {
                    return {auth: false, authResult: errorCode.AUCTION.NOT_AUTHORIZED};
                }
                return {auth: true, authResult: decoded};
            } else {
                return {auth: false, authResult: errorCode.AUCTION.INVALID_TOKEN};
            }
        } catch (error) {
            console.log('Socket message: Auth session token error: ' + error.message);
            return {auth: false, authResult: errorCode.AUCTION.INVALID_TOKEN};
        }
    };

    #startSession = async (socket, auctionToken, roles) => {
        try {
            const {auth, authResult} = this.#authSession(socket, auctionToken, roles);
            if (auth === false) {
                socket.emit('start_session_response', authResult);
                return;
            }
            const auction = await Auction.findById(authResult.sessionId).populate('auctioneer', 'name ssid phone');

            // Check valid auction status to start.
            if (!auction) {
                socket.emit('start_session_response', errorCode.AUCTION.NOT_FOUND);
                return;
            }
            if (auction.auction_start - Date.now() > 5 * 60 * 1000) {
                socket.emit('start_session_response', errorCode.AUCTION.NOT_TIME_YET);
                return;
            }
            if (auction.auction_end < Date.now()) {
                socket.emit('start_session_response', errorCode.AUCTION.ENDED);
                return;
            }
            if (this.#sessions.has(authResult.sessionId)) {
                socket.emit('start_session_response', errorCode.AUCTION.STARTED);
                return;
            }

            // Create new session auction in cache.
            this.#sessions.set(authResult.sessionId,
                await new AuctionSession(auction).init(),
                (auction.auction_end - Date.now()) / 1000);

            // Distribute biddings info to clients if exists.
            const biddings = this.#sessions.get(authResult.sessionId).getBiddings(authResult.role);
            if (biddings && biddings.length > 0) {
                this.io.to(authResult.sessionId).emit('biddings_update', biddings);
            }

            socket.emit('start_session_response', true);
        } catch (e) {
            console.log('Socket message: Socket error: ' + e.message);
            socket.emit('start_session_response', errorCode.INTERNAL_SERVER_ERROR);
        }
    };

    #joinSession = (socket, auctionToken, roles) => {

        try {
            const {auth, authResult} = this.#authSession(socket, auctionToken, roles);
            if (auth === false) {
                socket.emit('join_session_response', authResult);
                return;
            }

            const socketId = socket.id;
            const auctioneerRoomId = userRole.AUCTIONEER + authResult.sessionId;

            if (!this.#sessions.has(authResult.sessionId)) {
                socket.emit('join_session_response', errorCode.AUCTION.NOT_ON_GOING);
                return; // Session starting is required to join.
            }

            const session = this.#sessions.get(authResult.sessionId);
            if (!session.isOnGoing()) {
                socket.emit('join_session_response', errorCode.AUCTION.NOT_ON_GOING);
                return;
            }

            if (session) {
                if (!session.addUser(authResult.userId)) {
                    socket.emit('join_session_response', errorCode.AUCTION.NOT_AUTHORIZED);
                }

                let userSessions = this.#users.get(socketId) || new Set();
                userSessions.add(authResult);
                this.#users.set(socketId, userSessions);

                if (authResult.role === userRole.AUCTIONEER) socket.join(auctioneerRoomId);
                socket.join(authResult.sessionId);

                socket.emit('join_session_response', {
                    code: true,
                    joinInfo: session.getBidder(authResult.userId, authResult.role)
                });

                this.io.to(authResult.sessionId).except(auctioneerRoomId).emit('attendees_update', JSON.stringify(session.getRecentUsers(userRole.CUSTOMER)));
                this.io.to(auctioneerRoomId).emit('attendees_update', JSON.stringify(session.getRecentUsers(userRole.AUCTIONEER)));

                socket.emit('biddings_update', session.getBiddings(authResult.role));
                console.log('Socket message: ' + session.toString());
            }
        } catch (e) {
            console.log('Socket message: Socket error: ' + e);
            socket.emit('join_session_response', errorCode.INTERNAL_SERVER_ERROR);
        }
    };

    #disconnect = (socket) => {
        try {
            console.log(`Socket message: User ${socket.id} left session.`);
            const user = this.#users.get(socket.id);
            if (!user) return;
            for (const each of user) {
                const session = this.#sessions.get(each.sessionId);
                session.removeUser(each.userId);
                console.log('Socket message: ' + this.#sessions.get(each.sessionId).toString());
                this.io.to(each.sessionId).emit('attendees_update', JSON.stringify(session.getRecentUsers()));
            }

            this.#users.delete(socket.id);

        } catch (e) {
            console.log('Socket message: Socket error: ' + e);
            socket.emit('socket_error', errorCode.INTERNAL_SERVER_ERROR);
        }
    };

    #makeOffer = (socket, auctionToken, offer, roles) => {
        try {
            const {auth, authResult} = this.#authSession(socket, auctionToken, roles);
            if (auth === false) {
                socket.emit('make_offer_response', authResult);
                return;
            }
            const auctioneerRoomId = userRole.AUCTIONEER + authResult.sessionId;
            const session = this.#sessions.get(authResult.sessionId);
            const makeOfferResponse = session.makeOffer(authResult.userId, offer);
            if (makeOfferResponse !== true) socket.emit('make_offer_response', makeOfferResponse);
            else {
                this.io.to(authResult.sessionId).except(auctioneerRoomId).emit('biddings_update', session.getBiddings(userRole.CUSTOMER));
                this.io.to(auctioneerRoomId).emit('biddings_update', session.getBiddings(userRole.AUCTIONEER));
            }
        } catch (e) {
            console.log('Socket message: Socket error: ' + e.message);
            socket.emit('make_offer_response', errorCode.INTERNAL_SERVER_ERROR);
        }
    };

    #withdrawOffer = (socket, auctionToken, roles) => {
        try {
            const {auth, authResult} = this.#authSession(socket, auctionToken, roles);
            if (auth === false) {
                socket.emit('withdraw_offer_response', authResult);
                return;
            }
            const auctioneerRoomId = userRole.AUCTIONEER + authResult.sessionId;
            const session = this.#sessions.get(authResult.sessionId);
            const withdrawOfferResponse = session.withdrawOffer(authResult.userId);
            if (withdrawOfferResponse !== true) socket.emit('make_offer_response', withdrawOfferResponse);
            else {
                this.io.to(authResult.sessionId).except(auctioneerRoomId).emit('biddings_update', session.getBiddings(authResult.role));
                this.io.to(auctioneerRoomId).emit('biddings_update', session.getBiddings(userRole.AUCTIONEER));
            }
        } catch (e) {
            console.log('Socket message: Socket error: ' + e.message);
            socket.emit('withdraw_offer_response', errorCode.INTERNAL_SERVER_ERROR);
        }
    }
}

export const socketService = new SocketService();