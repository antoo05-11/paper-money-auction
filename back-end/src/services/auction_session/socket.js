import jwt from "jsonwebtoken";
import { AuctionRoom } from "./room";
import errorCode from "../../constants/error.code";

export class SocketService {
    #roomIds = new Set();
    #rooms = new Map();

    constructor(server) {
        this.io = require('socket.io')(server);

        this.io.on('connection', (socket) => {
            console.log(`User ${socket.id} connected`);

            socket.on('joinRoom', (auctionToken) => this.joinRoom(socket, auctionToken));

            socket.on('disconnect', () => {
                console.log(`User ${socket.id} disconnected.`);
            });
        });
    }

    joinRoom = (socket, auctionToken) => {
        const secretKey = process.env.JWT_AUCTION_KEY || "";

        try {
            const decoded = jwt.verify(auctionToken, secretKey);

            const userId = decoded.userId;
            const roomId = decoded.roomId;

            if (userId && roomId) {
                if (!this.#roomIds.has(roomId)) {
                    this.#roomIds.add(roomId);
                    this.#rooms.set(roomId, new AuctionRoom(roomId));
                }

                const room = this.#rooms.get(roomId);
                if (room) {
                    room.addUser(userId);
                    socket.join(roomId);
                    this.io.to(roomId).emit('attendees_update', room.getRoomBriefInfo());
                }
            }
        } catch (error) {
            socket.emit('joinRoomResponse', errorCode.INVALID_AUCTION_TOKEN);
        }
    }
}
