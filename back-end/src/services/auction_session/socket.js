import jwt from "jsonwebtoken";
import {AuctionRoom} from "./components/room";
import errorCode from "../../constants/error.code";
import {Server} from 'socket.io';
import {User} from "./components/user";


export class SocketService {
    #roomIds = new Set();
    #rooms = new Map();
    #users = new Map();

    constructor(httpServer) {
        this.io = new Server(httpServer);

        this.io.on('connection', (socket) => {

            socket.on('joinRoom', (auctionToken) => this.joinRoom(socket, auctionToken));

            socket.on('disconnect', () => this.leaveRoom(socket));
        });
    }

    joinRoom = (socket, auctionToken) => {
        const secretKey = process.env.JWT_AUCTION_KEY || "";
        const socketId = socket.id;

        try {
            const decoded = jwt.verify(auctionToken, secretKey);

            const userId = decoded.userId;
            const roomId = decoded.roomId;

            if (userId && roomId) {
                if (!this.#rooms.has(roomId)) {
                    this.#rooms.set(roomId, new AuctionRoom(roomId));
                }

                const room = this.#rooms.get(roomId);

                if (room) {
                    let user = this.#users.get(socketId);
                    if (!user) {
                        user = new User(socketId, userId);
                        this.#users.set(socketId, user);
                    }

                    room.addUser(user);
                    socket.join(roomId);
                    this.io.to(roomId).emit('attendees_update', room.getRoomBriefInfo());
                }
                console.log(room.toString());
            }

        } catch (error) {
            socket.emit('joinRoomResponse', errorCode.INVALID_AUCTION_TOKEN);
        }
    }

    leaveRoom = (socket) => {
        console.log(`User ${socket.id} left room.`);
        const user = this.#users.get(socket.id);
        for (const roomId of user.getUserRoomIds()) {
            const room = this.#rooms.get(roomId);
            room.removeUser(user);
            console.log(this.#rooms.get(roomId).toString());
            this.io.to(roomId).emit('attendees_update', room.getRoomBriefInfo());
        }
        this.#users.delete(user.socketId);
    }
}