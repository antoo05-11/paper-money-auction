import jwt from "jsonwebtoken";
import {AuctionSession} from "./auction_session/components/session";
import errorCode from "../constants/error.code";
import {Server} from 'socket.io';
import {Service} from "./service";
import {Auction} from "../models/auction";
import {Participation} from "../models/participation";
import mongoose from "mongoose";
import {Bidding} from "../models/bidding";
import schedule from "node-schedule";

let instance;

class SocketService extends Service {
    #sessions = new Map(); // Map socketId _ AuctionSession.
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

            socket.on('start_session', async (auctionToken) => this.#startSession(socket, auctionToken))

            socket.on('join_session', (auctionToken) => this.#joinSession(socket, auctionToken));

            socket.on('disconnect', () => this.#disconnect(socket));

            socket.on('make_offer', (auctionToken, offer) => this.#makeOffer(socket, auctionToken, offer))
        });
    }

    #authenticateSession = (socket, auctionToken) => {
        const secretKey = process.env.JWT_AUCTION_KEY || "";
        try {
            const decoded = jwt.verify(auctionToken, secretKey);
            delete decoded.iat
            delete decoded.exp
            // decode: {userId, sessionId, role}
            if (decoded.userId && decoded.sessionId && decoded.role) {
                return decoded;
            } else return null;
        } catch (error) {
            socket.emit('join_session_response', errorCode.AUCTION.INVALID_TOKEN);
            return null;
        }
    };

    #startSession = async (socket, auctionToken) => {
        const socketInfo = this.#authenticateSession(socket, auctionToken);
        if (socketInfo) {

            const auction = await Auction.findById(new mongoose.Types.ObjectId(socketInfo.sessionId));
            if (!auction) {
                socket.emit('start_session_response', errorCode.AUCTION.NOT_FOUND);
                return;
            }
            if (auction.auction_start > Date.now() + 5 * 60 * 1000) {
                socket.emit('start_session_response', errorCode.AUCTION.NOT_TIME_YET);
                return;
            }

            const participations = await Participation.find({auction: auction._id});
            const biddings = await Bidding.find({auction: auction._id});

            this.#sessions.set(socketInfo.sessionId, new AuctionSession(auction, participations, biddings));

            const sessionStarted = this.#sessions.get(socketInfo.sessionId);

            schedule.scheduleJob(sessionStarted.getSessionEndDate() + 1 * 60 * 1000, () => {
                this.#sessions.delete(socketInfo.sessionId);
                console.log(this.#sessions);
            });

            if (biddings && biddings.length > 0) {
                this.io.to(socketInfo.sessionId).emit("biddings_update", sessionStarted.getBiddings());
            }
            socket.emit('start_session_response', true);
        }
    };

    #joinSession = (socket, auctionToken) => {
        const socketId = socket.id;

        const socketInfo = this.#authenticateSession(socket, auctionToken);

        if (socketInfo) {

            if (!this.#sessions.has(socketInfo.sessionId)) {
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

    #makeOffer = (socket, auctionToken, offer) => {
        const socketInfo = this.#authenticateSession(socket, auctionToken);
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