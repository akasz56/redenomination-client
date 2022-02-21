import { io } from "socket.io-client";
import mainURL from "./serverURL";

const socket = io(mainURL, {
    transports: ["polling"],
    upgrade: false,
})

export default socket;