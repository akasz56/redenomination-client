import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import socket from "../../adapters/SocketIO";
import ReadyScreenHandler from "./ReadyScreenHandler";
import CompleteScreenHandler from "./CompleteScreenHandler";
import BlankScreen from "./BlankScreen";
import { alertUser, checkIfLoggedIn, logout, saveAuth } from "../../Utils";
import PhaseHandler from "./PhaseHandler";

export const participantStage = {
    READY: "READY",
    SIMULATION: "SIMULATION",
    COMPLETE: "COMPLETE",
}

export default function Participants() {
    const { state } = useLocation();
    const [stateData, setStateData] = useState({ ...state, sessionData: undefined });
    const [sessionData, setSessionData] = useState(state.sessionData);
    const [stateStage, setStateStage] = useState(false);

    useEffect(() => {
        function retryLogin() {
            const loggedIn = checkIfLoggedIn();
            if (loggedIn) {
                relogin(loggedIn);
            } else {
                window.alert("Anda belum terdaftar dalam server, silahkan coba masukkan token partisipan lagi");
                logout(() => { window.location.reload("/"); });
            }
        }

        function relogin(auth) {
            socket.emit("loginToken", { "token": auth.token.toUpperCase(), "username": auth.username });
            socket.on("serverMessage", res => {
                if (res.status === 200 && res.data.isSessionRunning) {
                    saveAuth("participant", { token: auth.token, username: auth.username, });
                    setStateData(res.data);
                } else {
                    alertUser(res)
                }
            })
        }

        function serverMessageHandler(res) {
            if (res.status === 401) { retryLogin() }
            else if (res.status === 403) { retryLogin() }
            else if (res.status >= 300) {
                alertUser(res)
                console.log("alertUser", res)
            } else {
                console.log("serverMsg", res)
            }
        }
        socket.on("serverMessage", serverMessageHandler)

        function sessionDataUpdateHandler(res) {
            console.log("sessionDataUpdate", res);
            setSessionData(res);
        }
        socket.on("sessionDataUpdate", sessionDataUpdateHandler);

        return () => {
            socket.off("serverMessage")
        }
    }, []);

    useEffect(() => {
        if (stateData.isSessionRunning) {
            if (sessionData.phaseId === participantStage.READY) { setStateStage(participantStage.READY); }
            else { setStateStage(participantStage.SIMULATION); }
        }
        else { setStateStage(participantStage.COMPLETE); }
    }, [stateData, sessionData])

    switch (stateStage) {
        case participantStage.READY:
            return <ReadyScreenHandler data={{ ...stateData, sessionData }} setStateStage={setStateStage} />
        case participantStage.SIMULATION:
            return <PhaseHandler data={{ ...stateData, sessionData }} setStateStage={setStateStage} />
        case participantStage.COMPLETE:
            return <CompleteScreenHandler data={{ ...stateData, sessionData }} />

        default:
            return <BlankScreen lineNumber="000" />
    }
}
