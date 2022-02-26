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
    const [stateData, setStateData] = useState({ ...state });
    const [stateStage, setStateStage] = useState(false);

    function retryLogin() {
        socket.emit("loginToken", { "token": state.detail.loginToken.toUpperCase(), "username": state.detail.username });
        socket.on("serverMessage", res => {
            if (res.status === 200 && res.data.isSessionRunning) {
                setStateData(res.data);
            } else { alertUser(res) }
        })
    }

    useEffect(() => {

        function serverMessageHandler(res) {
            if (res.status === 401) { retryLogin() }
            else if (res.status === 403) { retryLogin() }
            else if (res.status >= 300) { alertUser(res); console.log("alertUser", res) }
            else { console.log("serverMsg", res) }
        }
        socket.on("serverMessage", serverMessageHandler)

        function sessionDataUpdateHandler(res) {
            console.log("sessionDataUpdate", res);
            setStateData(prev => ({ ...prev, sessionData: res }));
        }
        socket.on("sessionDataUpdate", sessionDataUpdateHandler);

        return () => {
            socket.off("serverMessage")
            socket.off("sessionDataUpdate");
        }
    }, []);

    useEffect(() => {
        if (stateData.isSessionRunning) {
            if (stateData.sessionData.phaseId === participantStage.READY) { setStateStage(participantStage.READY); }
            else { setStateStage(participantStage.SIMULATION); }
        }
        else { setStateStage(participantStage.COMPLETE); }
    }, [stateData])

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
