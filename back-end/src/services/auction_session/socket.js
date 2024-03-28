import jwt from "jsonwebtoken";
import {AuctionSession} from "./components/session";
import errorCode from "../../constants/error.code";
import {Server} from 'socket.io';
import {User} from "./components/user";


export class SocketService {
    #sessionIds = new Set();
    #sessions = new Map();
    #users = new Map();

    constructor(httpServer) {
        this.io = new Server(httpServer);

        this.io.on('connection', (socket) => {

            socket.on('joinSession', (auctionToken) => this.joinSession(socket, auctionToken));

            socket.on('disconnect', () => this.disconnect(socket));
        });
    }

    joinSession = (socket, auctionToken) => {
        const secretKey = process.env.JWT_AUCTION_KEY || "";
        const socketId = socket.id;

        try {
            const decoded = jwt.verify(auctionToken, secretKey);

            const userId = decoded.userId;
            const sessionId = decoded.sessionId;

            if (userId && sessionId) {
                if (!this.#sessions.has(sessionId)) {
                    this.#sessions.set(sessionId, new AuctionSession(sessionId));
                }

                const session = this.#sessions.get(sessionId);

                if (session) {
                    let user = this.#users.get(socketId);
                    if (!user) {
                        user = new User(socketId, userId);
                        this.#users.set(socketId, user);
                    }

                    session.addUser(user);
                    socket.join(sessionId);

                    this.io.to(sessionId).emit('attendees_update', JSON.stringify(session.getSessionBriefInfo()));
                }
                console.log(session.toString());
            }

        } catch (error) {
            socket.emit('joinSessionResponse', errorCode.INVALID_AUCTION_TOKEN);
        }
    }

    disconnect = (socket) => {
        console.log(`User ${socket.id} left session.`);
        const user = this.#users.get(socket.id);
        for (const sessionId of user.getUserSessionIds()) {
            const session = this.#sessions.get(sessionId);
            session.removeUser(user);

            console.log(this.#sessions.get(sessionId).toString());

            this.io.to(sessionId).emit('attendees_update', JSON.stringify(session.getSessionBriefInfo()));
        }
        this.#users.delete(socket.id);
    }
}