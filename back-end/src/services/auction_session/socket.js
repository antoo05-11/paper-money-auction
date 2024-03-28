import jwt from "jsonwebtoken";
import {AuctionRoom} from "./components/room";
import errorCode from "../../constants/error.code";
import {Server} from 'socket.io';

export class SocketService {
    #roomIds = new Set();
    #rooms = new Map();

    constructor(httpServer) {
        this.io = new Server(httpServer);

        this.io.on('connection', (socket) => {
            console.log(`User ${socket.id} connected`);

            socket.on('joinRoom', (auctionToken) => this.joinRoom(socket, auctionToken));

            socket.on('disconnect', () => this.leaveRoom(socket));
        });
    }

    joinRoom = (socket, auctionToken) => {
        const secretKey = process.env.JWT_AUCTION_KEY || "";

        try {
            const decoded = jwt.verify(auctionToken, secretKey);

            const socketId = decoded.socketId;
            const userId = decoded.userId;
            const roomId = decoded.roomId;

            if (socketId && userId && roomId) {
                if (!this.#roomIds.has(roomId)) {
                    this.#roomIds.add(roomId);
                    this.#rooms.set(roomId, new AuctionRoom(roomId));
                }

                const room = this.#rooms.get(roomId);
                if (room) {
                    room.addUser(socketId, userId);
                    socket.join(roomId);
                    this.io.to(roomId).emit('attendees_update', room.getRoomBriefInfo());
                }
            }
        } catch (error) {
            socket.emit('joinRoomResponse', errorCode.INVALID_AUCTION_TOKEN);
        }
    }

    leaveRoom = (socket) => {
        console.log(`User ${socket.id} left room.`);
        this.#rooms.get()
    }
}
