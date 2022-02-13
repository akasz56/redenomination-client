import { io } from "socket.io-client";
import mainURL from "./serverURL";

const socket = io(mainURL);

export default socket;