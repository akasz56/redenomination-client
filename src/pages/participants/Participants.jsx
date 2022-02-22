import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import socket from "../../adapters/SocketIO";
import ReadyScreenHandler from "./ReadyScreenHandler";
import CompleteScreenHandler from "./CompleteScreenHandler";
import BlankScreen from "./BlankScreen";
import { checkIfLoggedIn, logout, printLog, saveAuth } from "../../Utils";
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

    useEffect(() => {
        function serverMessageHandler(res) {
            if (res.status === 401) {
                const loggedIn = checkIfLoggedIn();
                if (loggedIn) {
                    socket.emit("loginToken", { "token": loggedIn.token.toUpperCase(), "username": loggedIn.username });
                    socket.once("serverMessage", res => {
                        if (res.status === 200) {
                            if (res.data.isSessionRunning) {
                                saveAuth("participant", { token: loggedIn.token, username: loggedIn.username, });
                                setStateData(res.data)
                            } else {
                                window.alert("Simulasi belum dijalankan");
                                logout(() => { window.location.reload() })
                            }
                        } else {
                            printLog(res)
                            const msg = "(" + res.status + ") " + res.message;
                            window.alert(msg);
                        }
                    })
                }
            } else if (res.status >= 300) {
                printLog(res)
            }
        }
        socket.on("serverMessage", serverMessageHandler)

        return () => {
            socket.off("serverMessage")
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
