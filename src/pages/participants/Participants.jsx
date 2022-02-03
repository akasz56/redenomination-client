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
import Label from '../../components/Label';
import LoadingComponent from '../../components/Loading';

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

    useEffect(() => {
        document.title = phaseData.simulationType;

        socket.on("serverMessage", res => {
            if (res.status === 401) {
                window.alert("Anda belum terdaftar dalam server, silahkan coba masukkan token partisipan lagi");
                logout(() => { window.location.reload("/"); });
            } else {
                console.log(res)
            }
        })

        if (stage === 'ready') {
            function readyCountHandler(res) {
                if (res.numberOfReadyPlayer === res.totalPlayer) {
                    setData({ ...data, participantNumber: res.totalPlayer })
                    socket.emit("startPhase", { "phaseId": state.phases[0].id })
                    setTimer(minutes * 60);
                    setStage(firstStage);
                }
            }
            socket.on("readyCount", readyCountHandler);
        }

        else if (stage === 'otwComplete') {
            const myTotalProfit = profits.reduce((partialSum, a) => partialSum + a, 0);
            function collectedProfitHandler(res) {
                if (res.profitCollection.length === data.participantNumber) {
                    const allProfit = res.profitCollection.reduce((prev, profit) => prev + profit.value, 0)
                    const myReward = 5000 + Math.round((myTotalProfit / allProfit) * res.simulationBudget)
                    setData({ ...data, rewards: myReward })
                    socket.off("collectedProfit")
                    setStage("complete");
                }
            }
            socket.emit("collectProfit", { "myProfit": myTotalProfit })
            socket.on("collectedProfit", collectedProfitHandler);
        }

        else if (stage === 'postPrice' && phaseData.simulationType === "Posted Offer") {
            function postedOfferListHandler(res) {
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
                    });
                    setStage("flashSale");
                } else if (res.length > (data.participantNumber / 2)) {
                    // test purposes
                    socket.emit("finishPhase", { "phaseId": phaseData.currentPhase.id })
                    logout(() => { window.location.href = "/"; });
                }
            }
            socket.on("postedOfferList", postedOfferListHandler);
        }

        const interval = setInterval(() => { if (timer) { setTimer(timer - 1) } }, 1000);
        return () => {
            clearInterval(interval);
            socket.off("serverMessage")
        }
    });

    function phaseContinue(profit = 0) {
        setTimer(minutes * 60);
        switch (phaseData.currentPhase.phaseType) {
            case "preRedenomPrice":
                socket.emit("finishPhase", { "phaseId": phases[0].id })
                socket.emit("startPhase", { "phaseId": phases[1].id })
                setPhaseData({ ...phaseData, currentPhase: phases[1], phaseName: "Transisi Redenominasi" })
                setProfits([profit]);
                setStage(firstStage);
                break;
            case "transitionPrice":
                socket.emit("finishPhase", { "phaseId": phases[1].id })
                socket.emit("startPhase", { "phaseId": phases[2].id })
                setPhaseData({ ...phaseData, currentPhase: phases[2], phaseName: "Pasca Transisi Redenominasi" })
                setProfits([...profits, profit]);
                setStage(firstStage);
                break;
            case "postRedenomPrice":
                socket.emit("finishPhase", { "phaseId": phases[2].id })
                setProfits([...profits, profit]);
                setStage("otwComplete");
                break;

            default:
                break;
        }
    }

    if (stage === 'ready') {
        return <Ready socket={socket} data={{ ...phaseData, ...data }} />
    }
    else {
        switch (phaseData.simulationType) {
            case "Posted Offer":
                return PostedOfferHandler(stage, timer, socket, { ...phaseData, ...data }, phaseContinue)
            case "Double Auction":
                return DoubleAuctionHandler(stage, timer, socket, { ...phaseData, ...data }, phaseContinue)
            case "Decentralized":
                return DecentralizedHandler(stage, timer, socket, { ...phaseData, ...data }, phaseContinue)
            default:
                return <BlankScreen lineNumber="172" />
        }
    }

}

function PostedOfferHandler(stage, timer, socket, data, phaseContinue) {
    switch (stage) {
        case "postPrice":
            if (data.role === "seller") { return <PostPriceScreen socket={socket} data={data} timer={timer} /> }
            else if (data.role === "buyer") { return <BuyerIdleScreen socket={socket} data={data} timer={timer} /> }
            else { return <BlankScreen lineNumber="183" /> }

        case "flashSale":
            if (data.role === "seller") { return <SellerIdleScreen socket={socket} data={data} timer={timer} phaseContinue={phaseContinue} /> }
            else if (data.role === "buyer") { return <FlashSaleScreen socket={socket} data={data} timer={timer} phaseContinue={phaseContinue} /> }
            else { return <BlankScreen lineNumber="188" /> }

        case "complete":
        case "otwComplete":
            return <CompleteScreen data={data} />

        default:
            return <BlankScreen lineNumber="196" />
    }
}

function DoubleAuctionHandler(stage, timer, socket, data, phaseContinue) {
    switch (stage) {
        case "auctionScreen":
            if (data.role === "seller") { return <SellerAuctionScreen socket={socket} data={data} timer={timer} phaseContinue={phaseContinue} /> }
            else if (data.role === "buyer") { return <BuyerAuctionScreen socket={socket} data={data} timer={timer} phaseContinue={phaseContinue} /> }
            else { return <BlankScreen lineNumber="205" /> }

        case "complete":
        case "otwComplete":
            return <CompleteScreen data={data} />

        default:
            return <BlankScreen lineNumber="213" />
    }
}

function DecentralizedHandler(stage, timer, socket, data, phaseContinue) {
    switch (stage) {
        case "postPriceDS":
            if (data.role === "seller") { return <PostPriceDS socket={socket} data={data} timer={timer} /> }
            else if (data.role === "buyer") { return <BuyerIdleDS socket={socket} data={data} timer={timer} /> }
            else { return <BlankScreen lineNumber="222" /> }

        case "listShops":
            if (data.role === "seller") { return <SellerIdleDS socket={socket} data={data} timer={timer} phaseContinue={phaseContinue} /> }
            else if (data.role === "buyer") { return <Lobby socket={socket} data={data} timer={timer} phaseContinue={phaseContinue} /> }
            else { return <BlankScreen lineNumber="227" /> }

        case "complete":
        case "otwComplete":
            return <CompleteScreen data={data} />

        default:
            return <BlankScreen lineNumber="235" />
    }
}


function CompleteScreen({ data }) {
    const kontak = "6289608703393"

    function roundNumber(number) {
        const rounding = 100
        return Math.floor(number / rounding) * rounding;
    }

    function generateLink() {
        return "https://wa.me/" + kontak + "?text=Saya menerima reward sebesar " + data.rewards + " dalam simulasi " + data.simulationType + " (" + data.loginToken + ")"
    }

    return (
        <Container className='text-center d-flex flex-column'>
            <h1 className='text-center mt-5'>Simulasi Selesai</h1>
            {(data.rewards) ?
                <p className='mt-5'>
                    Selamat, anda mendapatkan hadiah sebesar
                    <span className='text-primary fw-bolder fs-1 d-block'>Rp. {roundNumber(data.rewards)}</span>
                    Silahkan klik tombol dibawah untuk menghubungi peneliti
                </p>
                :
                <LoadingComponent className="mx-auto my-5" />
            }

            <div className="mx-auto mt-4">
                <a href={generateLink()} className='btn btn-primary px-4 py-3 fs-3' target="_blank" rel="noreferrer">Kontak</a>
            </div>

            <Label
                className="mt-5 mx-auto"
                phase={data.simulationType + " (" + data.loginToken + ")"}
                goods={data.goodsType + " (" + capitalize(data.goodsName) + ")"}
                inflation={data.inflationType}
            />
        </Container>
    )
}

function BlankScreen({ lineNumber = 0 }) {
    return (
        <div className="child">
            Blank Screen : {lineNumber}
        </div>
    )
}