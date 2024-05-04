"use client";

import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {socket} from "../socket";
import {io} from "socket.io-client";

export default function Home() {
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");

    useEffect(() => {
        if (socket.connected) {
            onConnect();
        }

        function onConnect() {
            setIsConnected(true);
            setTransport(socket.io.engine.transport.name);

            socket.io.engine.on("upgrade", (transport) => {
                setTransport(transport.name);
            });
        }

        function onDisconnect() {
            setIsConnected(false);
            setTransport("N/A");
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        };
    }, []);

    function printSocket() {
        console.log(socket.id);
    }

    return (
        <div>
            <p>Status: {isConnected ? "connected" : "disconnected"}</p>
            <Button onClick={printSocket}>Socket</Button>
            <p>Transport: {transport}</p>
        </div>
    );
}