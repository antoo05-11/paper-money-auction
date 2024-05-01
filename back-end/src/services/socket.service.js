import jwt from "jsonwebtoken";
import {AuctionSession} from "./auction_session/components/session";
import errorCode from "../constants/error.code";
import {Server} from 'socket.io';
import {Service} from "./service";
import {Auction} from "../models/auction";
import mongoose from "mongoose";
import {Bidding} from "../models/bidding";
import cron from "node-cron";
import NodeCache from "node-cache";
import userRole from "../constants/user.role";

let instance;

// Schedule to finalize ended auctions every minute.
cron.schedule('* * * * *', () => {
    Auction.find({
        auction_end: {$lte: new Date()},
        winning_bidding: null
    }).then((expiredAuctions) => {
        for (const auction of expiredAuctions) {
            Bidding.findOne({
                auction: auction._id
            }).sort('-price').then((highestBidding) => {
                if (highestBidding) {
                    Auction.findByIdAndUpdate(auction._id, {
                        winning_bidding: highestBidding._id
                    }).then(() => {
                        console.log(`Auction ${auction._id} updated with winning bidding ${highestBidding._id}`);
                    });
                }
            });
        }
    });
});


class SocketService extends Service {
    #sessions = new NodeCache({stdTTL: 6 * 60 * 60, checkperiod: 120}); // Map socketId _ AuctionSession.
    #users = new Map(); // For tracking in_out only. Map socketId _ {sessionId, userId}.

    constructor() {
        super();
        if (instance) {
            throw new Error("SocketService must be constructed only one time!");
        }
        instance = this;
    }

    init(httpServer) {
        super.init();

        this.io = new Server(httpServer, {
            path: "/socket/", cors: {
                origin: '*',
            }
        });

        this.io.on('connection', (socket) => {

            console.log(socket.id + " connected.");

            socket.on('start_session', async (auctionToken) => this.#startSession(socket, auctionToken, [userRole.AUCTIONEER]))

            socket.on('join_session', (auctionToken) => this.#joinSession(socket, auctionToken, [userRole.AUCTIONEER, userRole.CUSTOMER, userRole.ASSET_OWNER]));

            socket.on('make_offer', (auctionToken, offer) => this.#makeOffer(socket, auctionToken, offer, [userRole.CUSTOMER]))

            socket.on('withdraw_offer', (auctionToken, offer) => this.#withdrawOffer(socket, auctionToken, offer, [userRole.CUSTOMER]))

            socket.on('disconnect', () => this.#disconnect(socket));
        });
    }

    #authSession = (socket, auctionToken, roles) => {
        const secretKey = process.env.JWT_AUCTION_KEY || "";
        try {
            const decoded = jwt.verify(auctionToken, secretKey);
            delete decoded.iat
            delete decoded.exp
            // decode: {userId, sessionId, role}
            if (decoded.userId && decoded.sessionId && decoded.role) {
                if (roles && !roles.includes(decoded.role)) {
                    socket.emit('join_session_response', errorCode.AUCTION.INVALID_TOKEN);
                    return null;
                }
                return decoded;
            } else return null;
        } catch (error) {
            socket.emit('join_session_response', errorCode.AUCTION.INVALID_TOKEN);
            return null;
        }
    };

    #startSession = async (socket, auctionToken, roles) => {
        try {
            const socketInfo = this.#authSession(socket, auctionToken, roles);
            if (socketInfo) {

                const auction = await Auction.findById(socketInfo.sessionId).populate('auctioneer', 'name ssid phone');
                ;

                // Check valid auction status to start.
                if (!auction) {
                    socket.emit('start_session_response', errorCode.AUCTION.NOT_FOUND);
                    return;
                }
                if (auction.auction_start - Date.now() > 5 * 60 * 1000) {
                    socket.emit('start_session_response', errorCode.AUCTION.NOT_TIME_YET);
                    return;
                }
                if (auction.auction_end - Date.now() < 5 * 60 * 1000) {
                    socket.emit('start_session_response', errorCode.AUCTION.ENDED);
                    return;
                }
                if (this.#sessions.has(socketInfo.sessionId)) {
                    socket.emit('start_session_response', errorCode.AUCTION.STARTED);
                    return;
                }

                // Create new session auction in cache.
                this.#sessions.set(socketInfo.sessionId,
                    await new AuctionSession(auction).init(),
                    (auction.auction_end - Date.now()) / 1000);
                // Distribute biddings info to clients if exists.
                const biddings = this.#sessions.get(socketInfo.sessionId).getBiddings(socketInfo.role);
                if (biddings && biddings.length > 0) {
                    this.io.to(socketInfo.sessionId).emit("biddings_update", biddings);
                }

                socket.emit('start_session_response', true);
            }
        } catch (e) {
            console.log("Socket error: " + e);
            socket.emit("socket_error", true);
        }
    };

    #joinSession = (socket, auctionToken, roles) => {
        try {
            const socketId = socket.id;

            const socketInfo = this.#authSession(socket, auctionToken, roles);

            const auctioneerRoomId = userRole.AUCTIONEER + socketInfo.sessionId;

            if (socketInfo) {

                if (!this.#sessions.has(socketInfo.sessionId)) {
                    socket.emit('join_session_response', errorCode.AUCTION.NOT_ON_GOING);
                    return; // Session starting is required.
                }

                const session = this.#sessions.get(socketInfo.sessionId);

                if (!session.isOnGoing()) {
                    socket.emit('join_session_response', errorCode.AUCTION.NOT_ON_GOING);
                    return;
                }

                if (session) {
                    if (!session.addUser(socketInfo.userId)) {
                        socket.emit('join_session_response', errorCode.AUCTION.NOT_AUTHORIZED);
                    }

                    let userSessions = this.#users.get(socketId) || new Set();
                    userSessions.add(socketInfo);
                    this.#users.set(socketId, userSessions);

                    if (socketInfo.role === userRole.AUCTIONEER) socket.join(auctioneerRoomId);
                    socket.join(socketInfo.sessionId);

                    socket.emit('join_session_response', true);

                    this.io.to(socketInfo.sessionId).except(auctioneerRoomId).emit('attendees_update', JSON.stringify(session.getRecentUsers(socketInfo.role)));
                    this.io.to(auctioneerRoomId).emit('attendees_update', JSON.stringify(session.getRecentUsers(userRole.AUCTIONEER)));

                    socket.emit('biddings_update', session.getBiddings(socketInfo.role));
                }
                console.log(session.toString());
            }
        } catch (e) {
            console.log("Socket error: " + e);
            socket.emit("socket_error", true);
        }
    };

    #disconnect = (socket) => {
        try {
            console.log(`User ${socket.id} left session.`);
            const user = this.#users.get(socket.id);
            if (!user) return;
            for (const each of user) {
                const session = this.#sessions.get(each.sessionId);
                session.removeUser(each.userId);
                console.log(this.#sessions.get(each.sessionId).toString());
                this.io.to(each.sessionId).emit('attendees_update', JSON.stringify(session.getRecentUsers()));
            }

            this.#users.delete(socket.id);

        } catch (e) {
            console.log("Socket error: " + e);
            socket.emit("socket_error", true);
        }
    };

    #makeOffer = (socket, auctionToken, offer, roles) => {
        try {
            const socketInfo = this.#authSession(socket, auctionToken, roles);
            const auctioneerRoomId = userRole.AUCTIONEER + socketInfo.sessionId;
            if (!socketInfo) {
                socket.emit('make_offer_response', errorCode.AUCTION.INVALID_TOKEN);
                return;
            }
            const session = this.#sessions.get(socketInfo.sessionId);
            const makeOfferResponse = session.makeOffer(socketInfo.userId, offer);
            if (makeOfferResponse !== true) socket.emit("make_offer_response", makeOfferResponse);
            else {
                this.io.to(socketInfo.sessionId).except(auctioneerRoomId).emit("biddings_update", session.getBiddings(socketInfo.role));
                this.io.to(auctioneerRoomId).emit("biddings_update", session.getBiddings(userRole.AUCTIONEER));
            }
        } catch (e) {
            console.log("Socket error: " + e.message);
            socket.emit("socket_error", true);
        }
    };

    #withdrawOffer = (socket, auctionToken, roles) => {
            const socketInfo = this.#authSession(socket, auctionToken, roles);
            const auctioneerRoomId = userRole.AUCTIONEER + socketInfo.sessionId;
            if (!socketInfo) {
                socket.emit('withdraw_offer_response', errorCode.AUCTION.INVALID_TOKEN);
                return;
            }
            const session = this.#sessions.get(socketInfo.sessionId);
            const withdrawOfferResponse = session.withdrawOffer(socketInfo.userId);
            if (withdrawOfferResponse !== true) socket.emit("make_offer_response", withdrawOfferResponse);
            else {
                this.io.to(socketInfo.sessionId).except(auctioneerRoomId).emit("biddings_update", session.getBiddings(socketInfo.role));
                this.io.to(auctioneerRoomId).emit("biddings_update", session.getBiddings(userRole.AUCTIONEER));
            }

    }
}

export const socketService = new SocketService();