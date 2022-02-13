import { io } from "socket.io-client";

const socket = io("https://api.experimentaleconomics-ipb.my.id/");

export default socket;