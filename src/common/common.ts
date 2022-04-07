import { io } from "socket.io-client";
const isDevelopment = true;

export const mainURL = isDevelopment
  ? "http://localhost:8000/"
  : "https://api.experimentaleconomics-ipb.my.id/";
export const apiURL = mainURL + "api/";
export const imgURL = mainURL + "static/";
export const socket = io(mainURL, {
  transports: ["polling"],
  upgrade: false,
});
