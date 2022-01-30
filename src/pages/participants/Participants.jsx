import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import socket from "../../adapters/SocketIO";
import Ready from "./Ready";
import { PostPriceScreen, SellerIdleScreen } from './posted-offer/Seller';
import { BuyerIdleScreen, FlashSaleScreen } from './posted-offer/Buyer';
import { SellerAuctionScreen, BuyerAuctionScreen } from './double-auction/DoubleAuction';
import { BuyerIdleDS, Lobby, PostPriceDS, SellerIdleDS } from './decentralized/Decentralized';
import { capitalize, logout } from '../../Utils';

export default function Participants() {
    const { state } = useLocation();
    const [data, setData] = useState({
        ...state.detail,
        role: state.type
    });
    const [phaseData, setPhaseData] = useState({
        currentPhase: state.phases[0],
        phaseName: "Pre-Redenominasi",
        simulationType: capitalize(state.simulationType),
        goodsType: capitalize(state.goodsType),
        goodsName: capitalize(state.goodsName),
        inflationType: capitalize(state.inflationType)
    });
    const phases = state.phases;
    const minutes = state.timer;
    const [stage, setStage] = useState('ready');
    const [timer, setTimer] = useState(minutes * 60);

    let nextStage;
    switch (phaseData.simulationType) {
        case "Posted Offer":
            nextStage = "postPrice"
            break;
        case "Double Auction":
            nextStage = "auctionScreen"
            break;
        case "Decentralized":
            nextStage = "postPriceDS"
            break;
        default:
            break;
    }

    useEffect(() => {
        document.title = phaseData.simulationType;

        socket.on("serverMessage", res => {
            if (res.status === 400) {
                console.log(res)
                window.alert("Anda belum terdaftar dalam server, silahkan coba masukkan token partisipan lagi");
                logout(() => { window.location.href = "/"; });
            }
        })

        if (stage === 'ready') {
            function readyRoutine() {
                socket.on("readyCount", (res) => {
                    if (res.numberOfReadyPlayer === res.totalPlayer) {
                        setData({ ...data, participantNumber: res.totalPlayer })
                        socket.emit("startPhase", { "phaseId": state.phases[0].id })
                        setStage(nextStage);
                    }
                });
            }
            readyRoutine()
        } else if (stage === 'postPrice' && phaseData.simulationType === "Posted Offer") {
            socket.on("postedOfferList", res => {
                if (res.length === (data.participantNumber / 2)) {
                    setData({
                        ...data, seller: res.map((item, i) => {
                            return {
                                sellerId: item.sellerId,
                                role: "Penjual " + (i + 1),
                                price: item.price,
                                status: (item.isSold) ? "done" : "",
                                postedOfferId: item.id
                            }
                        })
                    })
                    setStage("flashSale");
                } else if (res.length > (data.participantNumber / 2)) {
                    console.log("kelebihan pak");
                    console.log(res)
                    // test purposes
                    socket.emit("finishPhase", { "phaseId": phaseData.currentPhase.id })
                    logout(() => { window.location.href = "/"; });
                }
            })
        }

        const interval = setInterval(() => { if (timer) { setTimer(timer - 1) } }, 1000);
        return () => clearInterval(interval);
    });

    function checkPhase() {
        setTimer(minutes * 60);
        switch (phaseData.currentPhase.phaseType) {
            case "preRedenomPrice":
                socket.emit("finishPhase", { "phaseId": phases[0].id })
                socket.emit("startPhase", { "phaseId": phases[1].id })
                setPhaseData({ ...phaseData, currentPhase: phases[1], phaseName: "Transisi Redenominasi" })
                setStage(nextStage);
                break;
            case "transitionPrice":
                socket.emit("finishPhase", { "phaseId": phases[1].id })
                socket.emit("startPhase", { "phaseId": phases[2].id })
                setPhaseData({ ...phaseData, currentPhase: phases[2], phaseName: "Pasca Transisi Redenominasi" })
                setStage(nextStage);
                break;
            case "postRedenomPrice":
                setStage("complete");
                break;

            default:
                break;
        }
    }

    if (stage === 'ready')
        return <Ready socket={socket} data={{ ...phaseData, ...data }} />
    else {
        switch (phaseData.simulationType) {
            case "Posted Offer":
                return PostedOfferHandler(stage, timer, socket, { ...phaseData, ...data }, checkPhase)
            case "Double Auction":
                return DoubleAuctionHandler(stage, timer, socket, { ...phaseData, ...data }, checkPhase)
            case "Decentralized":
                return DecentralizedHandler(stage, timer, socket, { ...phaseData, ...data }, checkPhase)
            default:
                return <div />
        }
    }

}

function CompleteScreen({ socket, data }) {
    return (
        <Container>
            <h1 className='child'>Simulasi Selesai</h1>
        </Container>
    )
}

function PostedOfferHandler(stage, timer, socket, data, checkPhase) {
    switch (stage) {
        case "postPrice":
            if (data.role === "seller") { return <PostPriceScreen socket={socket} data={data} timer={timer} /> }
            else if (data.role === "buyer") { return <BuyerIdleScreen socket={socket} data={data} timer={timer} /> }
            else { return <div /> }

        case "flashSale":
            if (data.role === "seller") { return <SellerIdleScreen socket={socket} data={data} timer={timer} checkPhase={checkPhase} /> }
            else if (data.role === "buyer") { return <FlashSaleScreen socket={socket} data={data} timer={timer} checkPhase={checkPhase} /> }
            else { return <div /> }

        case "complete":
            if (data.role === "seller") { return <CompleteScreen socket={socket} data={data} /> }
            else if (data.role === "buyer") { return <CompleteScreen socket={socket} data={data} /> }
            else { return <div /> }

        default:
            return <div />
    }
}

function DoubleAuctionHandler(stage, setStage, socket, data, checkPhase) {
    switch (stage) {
        case "auctionScreen":
            if (data.role === "seller") { return <SellerAuctionScreen socket={socket} data={data} setStage={setStage} checkPhase={checkPhase} /> }
            else if (data.role === "buyer") { return <BuyerAuctionScreen socket={socket} data={data} setStage={setStage} checkPhase={checkPhase} /> }
            else { return <div /> }

        case "complete":
            if (data.role === "seller") { return <CompleteScreen socket={socket} data={data} /> }
            else if (data.role === "buyer") { return <CompleteScreen socket={socket} data={data} /> }
            else { return <div /> }

        default:
            return <div />
    }
}

function DecentralizedHandler(stage, setStage, socket, data, checkPhase) {
    switch (stage) {
        case "postPriceDS":
            if (data.role === "seller") { return <PostPriceDS socket={socket} data={data} setStage={setStage} /> }
            else if (data.role === "buyer") { return <BuyerIdleDS socket={socket} data={data} setStage={setStage} /> }
            else { return <div /> }

        case "listShops":
            if (data.role === "seller") { return <SellerIdleDS socket={socket} data={data} setStage={setStage} checkPhase={checkPhase} /> }
            else if (data.role === "buyer") { return <Lobby socket={socket} data={data} setStage={setStage} checkPhase={checkPhase} /> }
            else { return <div /> }

        case "complete":
            if (data.role === "seller") { return <CompleteScreen socket={socket} data={data} /> }
            else if (data.role === "buyer") { return <CompleteScreen socket={socket} data={data} /> }
            else { return <div /> }

        default:
            return <div />
    }
}