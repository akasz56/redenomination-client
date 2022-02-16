import { useState, useEffect } from "react";
import socket from "../../adapters/SocketIO";
import { sortPhases } from "../../Utils";
import Ready from "./Ready";
import CompleteScreen from "./CompleteScreen";
import BlankScreen from "./BlankScreen";

const participantStage = {
    READY: "READY",
    SIMULATION: "SIMULATION",
    COMPLETE: "COMPLETE",
}

export default function Participants() {
    const { state } = useLocation();
    const [stateData] = useState(state);
    const [stateStage, setStateStage] = useState(participantStage.READY);

    useEffect(() => {
        function serverMessageHandler(res) {
            if (res.status === 401) {
                window.alert("Anda belum terdaftar dalam server, silahkan coba masukkan token partisipan lagi");
                logout(() => { window.location.reload("/"); });
            } else if (res.status !== 200) {
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
            return <ReadyScreenHandler data={stateData} setStage={setStateStage} />
        case participantStage.SIMULATION:
            return <SimScreenHandler data={stateData} setStage={setStateStage} />
        case participantStage.COMPLETE:
            return <CompleteScreenHandler data={stateData} setStage={setStateStage} />

        default:
            return <BlankScreen lineNumber="000" />
    }
}

// ReadyScreen
function ReadyScreenHandler({ data, setStage }) {
    return <Ready />
}

// SimScreenHandler
function SimScreenHandler({ data, setStage }) {
    const phases = sortPhases(state.phases);
    const minutes = state.timer;
    const [data, setData] = useState({
        ...state.detail,
        role: state.type
    });
    const [phaseData, setPhaseData] = useState({
        currentPhase: phases[0],
        phaseName: "Pre-Redenominasi",
        simulationType: capitalize(state.simulationType),
        goodsType: capitalize(state.goodsType),
        goodsPic: state.goodsPic,
        goodsName: capitalize(state.goodsName),
        inflationType: capitalize(state.inflationType)
    });

    switch (data.simulationType) {
        case "Posted Offer":
            return <DAHandler />
        case "Double Auction":
            return <POHandler />
        case "Decentralized":
            return <DSHandler />
        default:
            return <BlankScreen lineNumber="172" />
    }
}
function DAHandler() { }
function POHandler() { }
function DSHandler() { }

// CompleteScreen
function CompleteScreenHandler({ data, setStage }) { }