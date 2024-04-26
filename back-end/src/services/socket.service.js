import jwt from "jsonwebtoken";
import {AuctionSession} from "./auction_session/components/session";
import errorCode from "../constants/error.code";
import {Server} from 'socket.io';
import {Service} from "./service";
import {utils} from "../utils/utils";
import {Auction} from "../models/auction";
import {Participation} from "../models/participation";
import mongoose from "mongoose";

let instance;

class SocketService extends Service {
    #sessions = new Map(); // Map socketId - AuctionSession.
    #users = new Map(); // For tracking in-out only. Map socketId - {sessionId, userId}.

    static LOWER_THRESHOLD_OFFER = 10000;
    static UPPER_THRESHOLD_OFFER = 20000;

    constructor() {
        super();
        if (instance) {
            throw new Error("Mail Service must be constructed only one time!");
        }
        instance = this;
    }

    init(httpServer) {
        super.init();

        this.io = new Server(httpServer);

        this.io.on('connection', (socket) => {

            socket.on('startSession', async (auctionToken) => this.#startSession(socket, auctionToken))

            socket.on('joinSession', (auctionToken) => this.#joinSession(socket, auctionToken));

            socket.on('disconnect', () => this.#disconnect(socket));

            socket.on('makeOffer', (auctionToken, offer) => this.#makeOffer(socket, auctionToken, offer))
        });
    }

    #authenticateSession = (socket, auctionToken) => {
        const secretKey = process.env.JWT_AUCTION_KEY || "";
        try {
            const decoded = jwt.verify(auctionToken, secretKey);
            const userId = decoded.userId;
            const sessionId = decoded.sessionId;
            delete decoded.iat
            delete decoded.exp
            if (userId && sessionId) {
                return decoded;
            } else return null;
        } catch (error) {
            socket.emit('joinSessionResponse', errorCode.AUCTION.INVALID_TOKEN);
            return null;
        }
    };

    #startSession = async (socket, auctionToken) => {
        const socketInfo = this.#authenticateSession(socket, auctionToken);
        if (socketInfo) {

            const auction = await Auction.findById(new mongoose.Types.ObjectId(socketInfo.sessionId));
            if (!auction) {
                socket.emit('startSessionResponse', errorCode.AUCTION.NOT_FOUND);
                return;
            }
            const participations = await Participation.find({auction: auction._id});
            this.#sessions.set(socketInfo.sessionId, new AuctionSession(auction, participations));
            socket.emit('startSessionResponse', true);
        }
    };

    #joinSession = (socket, auctionToken) => {
        const socketId = socket.id;

        const socketInfo = this.#authenticateSession(socket, auctionToken);

        if (socketInfo) {

            if (!this.#sessions.has(socketInfo.sessionId)) {
                return;
            }

            const session = this.#sessions.get(socketInfo.sessionId);

            if (session) {
                let userSessions = this.#users.get(socketId) || new Set();
                userSessions.add(socketInfo);
                this.#users.set(socketId, userSessions);
                session.addUser(socketInfo.userId);
                socket.join(socketInfo.sessionId);

                this.io.to(socketInfo.sessionId).emit('attendees_update', JSON.stringify(session.getSessionBriefInfo()));
            }
            console.log(session.toString());
        }
    };

    #disconnect = (socket) => {
        console.log(`User ${socket.id} left session.`);
        const user = this.#users.get(socket.id);
        for (const each of user) {
            const session = this.#sessions.get(each.sessionId);
            session.removeUser(each.userId);
            console.log(this.#sessions.get(each.sessionId).toString());
            this.io.to(each.sessionId).emit('attendees_update', JSON.stringify(session.getSessionBriefInfo()));
        }

        this.#users.delete(socket.id);
    };

    #makeOffer = (socket, auctionToken, offer) => {
        if (utils.isNumberInRange(offer, SocketService.LOWER_THRESHOLD_OFFER, SocketService.UPPER_THRESHOLD_OFFER)) {
            //TODO: Compare and Save into cache + async Using bidding object to save into DB + emit to users.

        }
    }
}

export const socketService = new SocketService();