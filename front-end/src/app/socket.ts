"use client";

import {io} from "socket.io-client";
import path from "path";

// export const socket = io("https://paper-money-auction.onrender.com/");
export const socket = io("http://localhost:3000/", {path: "/socket/", autoConnect: false});