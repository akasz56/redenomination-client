import { io } from "socket.io-client";

const socket = io("https://carbide-bongo-338115.et.r.appspot.com/");
// const socket = io("http://localhost:8000/");

export default socket;