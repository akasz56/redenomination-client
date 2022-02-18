import { io } from "socket.io-client";
import mainURL from "./serverURL";

const socket = io(mainURL);

socket.on("disconnect", (reason) => {
    console.log("disconnected gan", reason);
});

export default socket;