import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import socket from "../../adapters/SocketIO";
import ReadyScreenHandler from "./ReadyScreenHandler";
import CompleteScreenHandler from "./CompleteScreenHandler";
import BlankScreen from "./BlankScreen";
import { alertUser } from "../../Utils";
import PhaseHandler from "./PhaseHandler";

export const participantStage = {
    READY: "READY",
    SIMULATION: "SIMULATION",
    COMPLETE: "COMPLETE",
}

export default function Participants() {
    const { state } = useLocation();
    const [stateData, setStateData] = useState(state);
    const [stateStage, setStateStage] = useState(participantStage.READY);

    function retryLogin() {
        socket.emit("loginToken", { "token": state.detail.loginToken.toUpperCase(), "username": state.detail.username });
        function retryLoginHandler(res) {
            if (res.status === 200 && res.data.isSessionRunning) {
                setStateData(res.data);
                socket.off("serverMessage", retryLoginHandler)
            } else { alertUser(res) }
        }
        socket.once("serverMessage", retryLoginHandler)
    }

    useEffect(() => {
        function serverMessageHandler(res) {
            if (res.status === 401) { retryLogin() }
            else if (res.status === 403) { retryLogin() }
            else if (res.status >= 300) { alertUser(res); console.log("alertUser", res) }
            else { console.log("serverMsg", res) }
        }
        socket.on("serverMessage", serverMessageHandler)

        function sessionDataUpdateHandler(res) { console.log("sessionDataUpdate", res); }
        socket.on("sessionDataUpdate", sessionDataUpdateHandler);

        return () => {
            socket.off("serverMessage", serverMessageHandler);
            socket.off("sessionDataUpdate", sessionDataUpdateHandler);
        }
    }, []);

    switch (stateStage) {
        case participantStage.READY:
            return <ReadyScreenHandler data={stateData} setStateStage={setStateStage} setStateData={setStateData} />
        case participantStage.SIMULATION:
            return <PhaseHandler data={stateData} setStateStage={setStateStage} />
        case participantStage.COMPLETE:
            return <CompleteScreenHandler data={stateData} />

        default:
            return <BlankScreen lineNumber="000" />
    }
}
