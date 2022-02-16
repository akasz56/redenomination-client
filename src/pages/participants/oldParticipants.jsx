import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import socket from "../../adapters/SocketIO";
import Ready from "./Ready";
import CompleteScreen from "./CompleteScreen";
import BlankScreen from "./BlankScreen";
import { PostPriceScreen, SellerIdleScreen } from './posted-offer/Seller';
import { BuyerIdleScreen, FlashSaleScreen } from './posted-offer/Buyer';
import { SellerAuctionScreen, BuyerAuctionScreen } from './double-auction/DoubleAuction';
import { BuyerIdleDS, Lobby, PostPriceDS, SellerIdleDS } from './decentralized/Decentralized';
import { capitalize, logout, printLog } from '../../Utils';
import { useCallback } from 'react';

function sortPhases(phases) {
    const phase0 = phases.find((item) => { return item.phaseType === "preRedenomPrice" })
    const phase1 = phases.find((item) => { return item.phaseType === "transitionPrice" })
    const phase2 = phases.find((item) => { return item.phaseType === "postRedenomPrice" })
    return [phase0, phase1, phase2];
}

export default function Participants() {
    const { state } = useLocation();
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
    const [stage, setStage] = useState('ready');
    const [timer, setTimer] = useState(minutes * 60);
    const [profits, setProfits] = useState([]);

    let firstStage;
    switch (phaseData.simulationType) {
        case "Posted Offer":
            firstStage = "postPrice"
            break;
        case "Double Auction":
            firstStage = "auctionScreen"
            break;
        case "Decentralized":
            firstStage = "postPriceDS"
            break;
        default:
            break;
    }

    // Tab Title
    useEffect(() => {
        document.title = phaseData.simulationType;
    }, [phaseData]);

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

    // Ready Count Handler
    useEffect(() => {
        if (stage === 'ready') {
            function readyCountHandler(res) {
                if (res.numberOfReadyPlayer === res.totalPlayer) {
                    setData((prev) => ({ ...prev, participantNumber: res.totalPlayer }))
                    socket.emit("startPhase", { "phaseId": phases[0].id })
                    setTimer(minutes * 60);
                    setStage(firstStage);
                    socket.off("readyCount");
                }
            }
            socket.on("readyCount", readyCountHandler);
        }
    }, [firstStage, minutes, phases, stage]);

    // Profit Handler
    useEffect(() => {
        if (stage === 'otwComplete') {
            function collectedProfitHandler(res) {
                setData((prev) => ({ ...prev, rewards: res }))
                socket.off("collectedProfit")
                setStage("complete");
            }
            socket.emit("collectProfit", { participantId: data.id })
            socket.on("collectedProfit", collectedProfitHandler);
        }
    }, [stage, profits, data.id]);

    useEffect(() => {
        // Check if all Seller has inputted (Posted Offer)
        if (stage === 'postPrice') {
            function postedOfferListHandler(res) {
                setData((prev) => ({
                    ...prev,
                    seller: res.map((item, i) => ({
                        sellerId: item.sellerId,
                        role: "Penjual " + (i + 1),
                        price: item.price,
                        status: (item.isSold) ? "done" : "",
                        postedOfferId: item.id
                    }))
                }));
            }
            function isDonePOHandler(res) {
                if (res) {
                    setTimer(minutes * 60);
                    socket.off("postedOfferList");
                    socket.off("po:isDone");
                    setStage("flashSale");
                }
            }
            socket.on("postedOfferList", postedOfferListHandler);
            socket.on("po:isDone", isDonePOHandler);
        }

        // Check if all Seller has inputted (Decentralized)
        else if (stage === 'postPriceDS') {
            function decentralizedListHandler(res) {
                setData((prev) => ({
                    ...prev,
                    seller: res.map((item, i) => ({
                        sellerId: item.sellerId,
                        role: "Penjual " + (i + 1),
                        price: item.price,
                        isSold: item.isSold,
                        decentralizedId: item.id
                    }))
                }));
            }
            function isDoneDSHandler(res) {
                if (res) {
                    setTimer(minutes * 60);
                    socket.off("decentralizedList");
                    socket.off("ds:isDone");
                    setStage("listShops");
                }
            }
            socket.on("decentralizedList", decentralizedListHandler);
            socket.on("ds:isDone", isDoneDSHandler);
        }

        return () => {
            socket.off("postedOfferList");
            socket.off("decentralizedList");
            socket.off("po:isDone");
            socket.off("ds:isDone");
        }
    }, [stage, minutes])

    const phaseContinue = useCallback((profit) => {
        setTimer(minutes * 60);
        switch (phaseData.currentPhase.phaseType) {
            case "preRedenomPrice":
                socket.emit("finishPhase", { "phaseId": phases[0].id })
                socket.emit("startPhase", { "phaseId": phases[1].id })
                setPhaseData({ ...phaseData, currentPhase: phases[1], phaseName: "Transisi Redenominasi" })
                setProfits(profit);
                setStage(firstStage);
                break;
            case "transitionPrice":
                socket.emit("finishPhase", { "phaseId": phases[1].id })
                socket.emit("startPhase", { "phaseId": phases[2].id })
                setPhaseData({ ...phaseData, currentPhase: phases[2], phaseName: "Pasca Transisi Redenominasi" })
                setProfits(prev => [prev, profit]);
                setStage(firstStage);
                break;
            case "postRedenomPrice":
                socket.emit("finishPhase", { "phaseId": phases[2].id })
                setProfits(prev => [...prev, profit]);
                setStage("otwComplete");
                break;

            default:
                break;
        }
    }, [firstStage, minutes, phaseData, phases]);


    if (stage === 'ready') {
        return <Ready data={{ ...phaseData, ...data }} />
    }
    else {
        switch (phaseData.simulationType) {
            case "Posted Offer":
                return PostedOfferHandler(stage, timer, { ...phaseData, ...data }, phaseContinue)
            case "Double Auction":
                return DoubleAuctionHandler(stage, timer, { ...phaseData, ...data }, phaseContinue)
            case "Decentralized":
                return DecentralizedHandler(stage, timer, { ...phaseData, ...data }, phaseContinue)
            default:
                return <BlankScreen lineNumber="172" />
        }
    }

}

function PostedOfferHandler(stage, timer, data, phaseContinue) {
    switch (stage) {
        case "postPrice":
            if (data.role === "seller") { return <PostPriceScreen data={data} timer={timer} /> }
            else if (data.role === "buyer") { return <BuyerIdleScreen data={data} timer={timer} /> }
            else { return <BlankScreen lineNumber="183" /> }

        case "flashSale":
            if (data.role === "seller") { return <SellerIdleScreen data={data} timer={timer} phaseContinue={phaseContinue} /> }
            else if (data.role === "buyer") { return <FlashSaleScreen data={data} timer={timer} phaseContinue={phaseContinue} /> }
            else { return <BlankScreen lineNumber="188" /> }

        case "complete":
        case "otwComplete":
            return <CompleteScreen data={data} />

        default:
            return <BlankScreen lineNumber="196" />
    }
}

function DoubleAuctionHandler(stage, timer, data, phaseContinue) {
    switch (stage) {
        case "auctionScreen":
            if (data.role === "seller") { return <SellerAuctionScreen data={data} timer={timer} phaseContinue={phaseContinue} /> }
            else if (data.role === "buyer") { return <BuyerAuctionScreen data={data} timer={timer} phaseContinue={phaseContinue} /> }
            else { return <BlankScreen lineNumber="205" /> }

        case "complete":
        case "otwComplete":
            return <CompleteScreen data={data} />

        default:
            return <BlankScreen lineNumber="213" />
    }
}

function DecentralizedHandler(stage, timer, data, phaseContinue) {
    switch (stage) {
        case "postPriceDS":
            if (data.role === "seller") { return <PostPriceDS data={data} timer={timer} /> }
            else if (data.role === "buyer") { return <BuyerIdleDS data={data} timer={timer} /> }
            else { return <BlankScreen lineNumber="222" /> }

        case "listShops":
            if (data.role === "seller") { return <SellerIdleDS data={data} timer={timer} phaseContinue={phaseContinue} /> }
            else if (data.role === "buyer") { return <Lobby data={data} timer={timer} phaseContinue={phaseContinue} /> }
            else { return <BlankScreen lineNumber="227" /> }

        case "complete":
        case "otwComplete":
            return <CompleteScreen data={data} />

        default:
            return <BlankScreen lineNumber="235" />
    }
}
