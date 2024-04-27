import jwt from "jsonwebtoken";
import {AuctionSession} from "./auction_session/components/session";
import errorCode from "../constants/error.code";
import {Server} from 'socket.io';
import {Service} from "./service";
import {Auction} from "../models/auction";
import {Participation} from "../models/participation";
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

        this.io = new Server(httpServer);

        this.io.on('connection', (socket) => {

            socket.on('start_session', async (auctionToken) => this.#startSession(socket, auctionToken, [userRole.AUCTIONEER]))

            socket.on('join_session', (auctionToken) => this.#joinSession(socket, auctionToken, [userRole.AUCTIONEER, userRole.CUSTOMER]));

            socket.on('make_offer', (auctionToken, offer) => this.#makeOffer(socket, auctionToken, offer, [userRole.CUSTOMER]))

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
        const socketInfo = this.#authSession(socket, auctionToken, roles);
        if (socketInfo) {

            const auction = await Auction.findById(new mongoose.Types.ObjectId(socketInfo.sessionId));

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
            const participations = await Participation.find({auction: auction._id});
            const biddings = await Bidding.find({auction: auction._id});

            this.#sessions.set(socketInfo.sessionId,
                new AuctionSession(auction, participations, biddings),
                (auction.auction_end - Date.now()) / 1000);

            const sessionStarted = this.#sessions.get(socketInfo.sessionId);
            if (biddings && biddings.length > 0) {
                this.io.to(socketInfo.sessionId).emit("biddings_update", sessionStarted.getBiddings());
            }

            socket.emit('start_session_response', true);
        }
    };

    #joinSession = (socket, auctionToken, roles) => {
        const socketId = socket.id;

        const socketInfo = this.#authSession(socket, auctionToken, roles);

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
                let userSessions = this.#users.get(socketId) || new Set();
                userSessions.add(socketInfo);
                this.#users.set(socketId, userSessions);
                session.addUser(socketInfo.userId);
                socket.join(socketInfo.sessionId);
                this.io.to(socketInfo.sessionId).emit('join_session_response', true);
                this.io.to(socketInfo.sessionId).emit('attendees_update', JSON.stringify(session.getSessionBriefInfo()));
            }
            console.log(session.toString());
        }
    };

    #disconnect = (socket) => {
        console.log(`User ${socket.id} left session.`);
        const user = this.#users.get(socket.id);
        if (!user) return;
        for (const each of user) {
            const session = this.#sessions.get(each.sessionId);
            session.removeUser(each.userId);
            console.log(this.#sessions.get(each.sessionId).toString());
            this.io.to(each.sessionId).emit('attendees_update', JSON.stringify(session.getSessionBriefInfo()));
        }

        this.#users.delete(socket.id);
    };

    #makeOffer = (socket, auctionToken, offer, roles) => {
        const socketInfo = this.#authSession(socket, auctionToken, roles);
        if (!socketInfo) {
            socket.emit('make_offer_response', errorCode.AUCTION.INVALID_TOKEN);
            return;
        }
        const session = this.#sessions.get(socketInfo.sessionId)
        const makeOfferResponse = session.makeOffer(socketInfo.userId, offer);
        if (makeOfferResponse !== true) socket.emit("make_offer_response", makeOfferResponse);
        else this.io.to(socketInfo.sessionId).emit("biddings_update", session.getBiddings());
    };
}

export const socketService = new SocketService();