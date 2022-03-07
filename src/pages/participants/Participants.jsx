import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import socket from "../../adapters/SocketIO";
import ReadyScreenHandler from "./ReadyScreenHandler";
import CompleteScreenHandler from "./CompleteScreenHandler";
import BlankScreen from "./BlankScreen";
import { alertUserSocket, saveAuth } from "../../Utils";
import PhaseHandler from "./PhaseHandler";

export const participantStage = {
    READY: "READY",
    SIMULATION: "SIMULATION",
    COMPLETE: "COMPLETE",
}

export default function Participants() {
    const { state } = useLocation();
    if (state === null) {
        alertUserSocket({ status: "000", message: "Anda belum terdaftar, silahkan login dahulu" })
        window.location.href = "/";
    }
    const [stateData, setStateData] = useState(state);
    const [stateStage, setStateStage] = useState(participantStage.READY);

    useEffect(() => {
        function retryLogin() {
            socket.emit("loginToken", { "token": state.detail.loginToken.toUpperCase(), "username": state.detail.username });
            function retryLoginHandler(res) {
                console.log("retryLoginHandler")
                if (res.status === 200 && res.data.isSessionRunning) {
                    setStateData(res.data);
                    saveAuth('participant', socket.id);
                    socket.off("serverMessage", retryLoginHandler)
                }
            }
            socket.on("serverMessage", retryLoginHandler)
        }

        socket.on("connect", () => {
            const socketId = JSON.parse(localStorage.getItem('auth'));
            if (socketId !== null && socketId.role === 'participant') {
                if (socketId !== socket.id) { retryLogin() }
            } else {
                window.location.href = "/";
            }
        });

        function serverMessageHandler(res) {
            if (res.status === 401) { retryLogin() }
            else if (res.status === 403) { retryLogin() }
            else if (res.status >= 300) { alertUserSocket(res) }
        }
        socket.on("serverMessage", serverMessageHandler)

        function sessionDataUpdateHandler(res) {
            console.log("sessionDataUpdateHandler", res)
            setStateData(prev => ({
                ...prev,
                sessionData: res,
            }));
        }
        socket.on("sessionDataUpdate", sessionDataUpdateHandler);

        return () => {
            socket.off("serverMessage", serverMessageHandler);
            socket.off("sessionDataUpdate", sessionDataUpdateHandler);
        }
    }, [state]);

    switch (stateStage) {
        case participantStage.READY:
            return <ReadyScreenHandler data={stateData} setStateStage={setStateStage} />
        case participantStage.SIMULATION:
            return <PhaseHandler data={stateData} setStateStage={setStateStage} />
        case participantStage.COMPLETE:
            return <CompleteScreenHandler data={stateData} />

        default:
            return <BlankScreen lineNumber="000" />
    }
}
