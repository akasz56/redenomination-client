import { io } from "socket.io-client";
import mainURL from "./serverURL";

const socket = io.connect(mainURL, {
    "transports": ['websocket']
})

socket.on("disconnect", (reason) => {
    console.log("disconnected gan", reason);
});

export default socket;