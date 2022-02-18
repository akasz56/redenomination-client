import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import socket from "../../adapters/SocketIO";
import ReadyScreenHandler from "./ReadyScreenHandler";
import CompleteScreenHandler from "./CompleteScreenHandler";
import BlankScreen from "./BlankScreen";
import { logout, printLog } from "../../Utils";
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
                window.alert("Anda belum terdaftar dalam server, silahkan coba masukkan token partisipan lagi");
                logout(() => { window.location.reload("/"); });
            } else {
                printLog(res)
            }
        }
        socket.on("serverMessage", serverMessageHandler)
        console.log(socket._callbacks);

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
