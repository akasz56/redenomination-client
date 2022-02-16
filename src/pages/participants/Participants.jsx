import { useEffect, useReducer } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import socket from "../../adapters/SocketIO";
import { capitalize, logout, printLog, sortPhases } from "../../Utils";
import BlankScreen from "./BlankScreen";

const ACTIONS = {

}

function phaseReducer(prevState, action) {
    switch (action.type) {
        case ACTIONS:
            return prevState;

        default:
            printLog("unhandled reduce")
            return prevState;
    }
}

function PostedOfferHandler({ data }) {
    const [phaseData, phaseDispatch] = useReducer(phaseReducer, {
        phases: sortPhases(data.phases),
        currentPhase: sortPhases(data.phases)[0],
        phaseName: "Pre-Redenominasi",
        simulationType: capitalize(data.simulationType),
        goodsType: capitalize(data.goodsType),
        goodsPic: data.goodsPic,
        goodsName: capitalize(data.goodsName),
        inflationType: capitalize(data.inflationType)
    });
    const [stage, setStage] = useState("postPrice");
    const [timer, setTimer] = useState(0);

    // Timer
    useEffect(() => {
        const interval = setInterval(() => { if (timer) { setTimer(timer - 1) } }, 1000);

        return () => {
            clearInterval(interval);
        }
    });

    switch (stage) {
        case "postPrice":
            if (data.role === "seller") { return <PostPriceScreen data={data} timer={timer} /> }
            else if (data.role === "buyer") { return <BuyerIdleScreen data={data} timer={timer} /> }
            else { return <BlankScreen lineNumber="183" /> }

        case "flashSale":
            if (data.role === "seller") { return <SellerIdleScreen data={data} timer={timer} /> }
            else if (data.role === "buyer") { return <FlashSaleScreen data={data} timer={timer} /> }
            else { return <BlankScreen lineNumber="188" /> }

        case "complete":
            return <CompleteScreen data={data} />

        default:
            return <BlankScreen lineNumber="196" />
    }
}
function DoubleAuctionHandler({ data }) {
    const [phaseData, phaseDispatch] = useReducer(phaseReducer, {
        phases: sortPhases(data.phases),
        currentPhase: sortPhases(data.phases)[0],
        phaseName: "Pre-Redenominasi",
        simulationType: capitalize(data.simulationType),
        goodsType: capitalize(data.goodsType),
        goodsPic: data.goodsPic,
        goodsName: capitalize(data.goodsName),
        inflationType: capitalize(data.inflationType)
    });
    const [stage, setStage] = useState("auctionScreen");
    const [timer, setTimer] = useState(0);

    // Timer
    useEffect(() => {
        const interval = setInterval(() => { if (timer) { setTimer(timer - 1) } }, 1000);

        return () => {
            clearInterval(interval);
        }
    });

    switch (stage) {
        case "auctionScreen":
            if (data.role === "seller") { return <SellerAuctionScreen data={data} timer={timer} /> }
            else if (data.role === "buyer") { return <BuyerAuctionScreen data={data} timer={timer} /> }
            else { return <BlankScreen lineNumber="205" /> }

        case "complete":
            return <CompleteScreen data={data} />

        default:
            return <BlankScreen lineNumber="213" />
    }
}
function DecentralizedHandler({ data }) {
    const [phaseData, phaseDispatch] = useReducer(phaseReducer, {
        phases: sortPhases(data.phases),
        currentPhase: sortPhases(data.phases)[0],
        phaseName: "Pre-Redenominasi",
        simulationType: capitalize(data.simulationType),
        goodsType: capitalize(data.goodsType),
        goodsPic: data.goodsPic,
        goodsName: capitalize(data.goodsName),
        inflationType: capitalize(data.inflationType)
    });
    const [stage, setStage] = useState("postPriceDS");
    const [timer, setTimer] = useState(0);

    // Timer
    useEffect(() => {
        const interval = setInterval(() => { if (timer) { setTimer(timer - 1) } }, 1000);

        return () => {
            clearInterval(interval);
        }
    });

    switch (stage) {
        case "postPriceDS":
            if (data.role === "seller") { return <PostPriceDS data={data} timer={timer} /> }
            else if (data.role === "buyer") { return <BuyerIdleDS data={data} timer={timer} /> }
            else { return <BlankScreen lineNumber="222" /> }

        case "listShops":
            if (data.role === "seller") { return <SellerIdleDS data={data} timer={timer} /> }
            else if (data.role === "buyer") { return <Lobby data={data} timer={timer} /> }
            else { return <BlankScreen lineNumber="227" /> }

        case "complete":
            return <CompleteScreen data={data} />

        default:
            return <BlankScreen lineNumber="235" />
    }
}

export default function Participants() {
    const { state } = useLocation();

    // Tab Title
    useEffect(() => {
        document.title = capitalize(state.simulationType);
    }, [state.simulationType]);

    // Message from Server Handler
    useEffect(() => {
        socket.on("serverMessage", res => {
            if (res.status === 401) {
                window.alert("Anda belum terdaftar dalam server, silahkan coba masukkan token partisipan lagi");
                logout(() => { window.location.reload("/"); });
            } else if (res.status !== 200) {
                printLog(res)
            }
        })

        return () => {
            socket.off("serverMessage")
        }
    }, []);

    switch (phaseData.simulationType) {
        case "Posted Offer":
            return <PostedOfferHandler data={{ ...state }} />
        case "Double Auction":
            return <DoubleAuctionHandler data={{ ...state }} />
        case "Decentralized":
            return <DecentralizedHandler data={{ ...state }} />
        default:
            return <BlankScreen lineNumber="000" />
    }
}
