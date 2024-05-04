"use client";

import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {socket} from "../socket";
import React from "react";
import {Input} from "@/components/ui/input";
import {Space} from "lucide-react";

export default function Home() {
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");

    const [sessionStarted, setSessionStarted] = useState<boolean>(false);
    const [sessionJoined, setSessionJoined] = useState<boolean>(false);
    const [offerMade, setOfferMade] = useState<boolean>(false);

    const [price, setPrice] = useState("");
    const [token, setToken] = useState("");

    useEffect(() => {
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

        if (isConnected) {
            socket.connect();

            socket.on("connect", onConnect);
            socket.on("disconnect", onDisconnect);
            socket.on('socket_error', (message) => {
                console.log('socket_error: ', message);
            });
            socket.on('join_session_response', (response) => {
                console.log("join_session_response")
                console.log(response);
            });
            socket.on('attendees_update', (response) => {
                console.log("attendees_update: " + response);
            });
            socket.on('make_offer_response', (message) => {
                console.log("make_offer_response")
                console.log(message);
            });
            socket.on('biddings_update', (message) => {
                console.log("biddings_update")
                console.log(message);
            });
            socket.on("start_session_response", (message) => {
                console.log("start_session_response")
                console.log(message);
            });
            socket.on("join_session_response", (message) => {
                console.log("join_session_response")
                console.log(message);
            });

            return () => {
                socket.off("connect", onConnect);
                socket.off("disconnect", onDisconnect);
                socket.off("socket_error");
                socket.off("join_session_response");
                socket.off("attendees_update");
                socket.off("make_offer_response");
                socket.off("biddings_update");
                socket.off("start_session_response");
                socket.off("join_session_response");
            };
        }
    }, [isConnected]);

    useEffect(() => {
        if (sessionStarted) {
            console.log("start session")
            socket.emit("start_session", token);
        }
    }, [sessionStarted]);

    useEffect(() => {
        if (sessionJoined) {
            console.log("join session")
            socket.emit("join_session", token);
        }
    }, [sessionJoined]);

    useEffect(() => {
        if (offerMade) {
            console.log("make offer")
            socket.emit("make_offer", token, price);
        }
    }, [offerMade]);


    function printSocket() {
        console.log(socket.id);
    }

    return (
        <div>
            <p>Status: {isConnected ? "connected" : "disconnected"}</p>
            <Button onClick={() => {
                setIsConnected(true);
            }}>Connect Socket</Button>
            <Button onClick={printSocket}>Socket Info</Button>
            <Input id={"token"} className={'mt-10'} placeholder={"Nhap token vo day???"} onChange={(e) => {
                setToken(e.target.value)
            }} value={token}/>
            <Button onClick={() => {
                setSessionStarted(!sessionStarted);
            }}>Start Session</Button>
            <Button onClick={() => {
                setSessionJoined(!sessionJoined);
            }}>Join Session</Button>

            <Input id={"price"} className={'mt-10'} placeholder={"Nhap gia tien vo day???"} onChange={(e) => {
                setPrice(e.target.value)
            }} value={price}/>
            <Button onClick={() => {
                setOfferMade(!offerMade);
            }}>Make offer</Button>
        </div>
    );
}