import { io } from "socket.io-client";
import mainURL from "./serverURL";

const socket = io(mainURL);

socket.on("connect", () => {
    console.log("connected");
    const engine = socket.io.engine;
    console.log(engine.transport.name); // in most cases, prints "polling"

    engine.once("upgrade", () => {
        // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
        console.log(engine.transport.name); // in most cases, prints "websocket"
    });

    engine.on("packet", ({ type, data }) => {
        console.log("packet", { type, data })
        // called for each packet received
    });

    engine.on("packetCreate", ({ type, data }) => {
        console.log("packetCreate", { type, data })
        // called for each packet sent
    });

    engine.on("drain", () => {
        console.log("drain")
        // called when the write buffer is drained
    });

    engine.on("close", (reason) => {
        console.log("close", reason)
        // called when the underlying connection is closed
    });
});

socket.on("disconnect", (reason) => {
    console.log("disconnected gan", reason);
});

export default socket;