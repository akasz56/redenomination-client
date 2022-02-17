import { useState, useEffect, useReducer } from "react"
import socket from "../../adapters/SocketIO"
import { capitalize, printLog, sortPhases } from "../../Utils"
import BlankScreen from "./BlankScreen"
import { participantStage } from "./Participants"
import { BuyerIdleDS, ShopHandler } from "./decentralized/Buyer"
import { PostPriceDS, SellerIdleDS } from "./decentralized/Seller"
import { BuyerIdleScreen, FlashSaleScreen } from "./posted-offer/Buyer"
import { PostPriceScreen, SellerIdleScreen } from "./posted-offer/Seller"
import BuyerAuctionScreen from "./double-auction/Buyer"
import SellerAuctionScreen from "./double-auction/Seller"
import LoadingComponent from "../../components/Loading"

const simulationType = {
    PO: "Posted Offer",
    DA: "Double Auction",
    DS: "Decentralized",
}

const phaseName = [
    "Pre-Redenominasi",
    "Transisi Redenominasi",
    "Pasca Transisi Redenominasi"
]

const reducerActions = {
    INIT_PHASE: "INIT_PHASE",
    NEXT_PHASE: "NEXT_PHASE",
    CHECK_CURRENT_PHASE: "CHECK_CURRENT_PHASE",
}

export default function PhaseHandler({ data, setStateStage }) {
    const initialState = {
        phases: sortPhases(data.phases),
        currentPhase: sortPhases(data.phases)[0],
        currentPhaseIndex: 0,
    }

    function reducer(prevState, action) {
        switch (action.type) {
            case reducerActions.INIT_PHASE:
                socket.emit("startPhase", { "phaseId": prevState.phases[0].id })
                return {
                    ...prevState,
                    currentPhase: { ...prevState.phases[0], phaseName: phaseName[0] },
                    currentPhaseIndex: 0,
                };

            case reducerActions.NEXT_PHASE:
                socket.emit("finishPhase", { "phaseId": prevState.currentPhase.id })
                const nextIndex = prevState.currentPhaseIndex + 1;
                if (nextIndex >= 3) {
                    setStateStage(participantStage.COMPLETE);
                    return prevState;
                } else {
                    socket.emit("startPhase", { "phaseId": prevState.phases[nextIndex].id })
                    return {
                        ...prevState,
                        currentPhase: { ...prevState.phases[nextIndex], phaseName: phaseName[nextIndex] },
                        currentPhaseIndex: nextIndex,
                    };
                }

            case reducerActions.CHECK_CURRENT_PHASE:
                printLog(prevState)
                return prevState;

            default:
                printLog("unhandled phase reduce")
                return prevState;
        }
    }

    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        dispatch({ type: reducerActions.INIT_PHASE })
    }, [])

    switch (capitalize(data.simulationType)) {
        case simulationType.DA:
            return <DAHandler data={{ ...data, ...state }} dispatch={dispatch} />
        case simulationType.PO:
            return <POHandler data={{ ...data, ...state }} dispatch={dispatch} />
        case simulationType.DS:
            return <DSHandler data={{ ...data, ...state }} dispatch={dispatch} />

        default:
            return <BlankScreen lineNumber="001" />
    }
}

const doubleAuctionStages = {
    AUCTION: "AUCTION",
    BREAK: "BREAK",
}
function DAHandler({ data, dispatch }) {
    const [matched, setMatched] = useState(false);
    const [socketData, setSocketData] = useState({ minPrice: "-", maxPrice: "-" });
    const [stage, setStage] = useState(doubleAuctionStages.AUCTION);
    const [timer, setTimer] = useState(data.timer * 60);

    // eventListener
    useEffect(() => {
        function doubleAuctionListHandler(res) {
            // consolelog("doubleAuctionListHandler", res);
            setSocketData({
                minPrice: res.minPrice,
                maxPrice: res.maxPrice
            });
        }
        socket.on("doubleAuctionList", doubleAuctionListHandler);

        function isDoneDAHandler(res) {
            // consolelog("isDoneDAHandler", res);
            setStage(doubleAuctionStages.BREAK);
        }
        socket.on("da:isDone", isDoneDAHandler);

        function bidMatchHandler(res) {
            // consolelog("bidMatchHandler", res);
            setMatched(true);
        }
        socket.on("bidMatch", bidMatchHandler);

        return () => {
            socket.off("doubleAuctionList");
            socket.off("da:isDone");
            socket.off("bidMatch");
        }
    }, [])

    // resetTimer
    useEffect(() => {
        // consolelog("resetTimer");
        setTimer(data.timer * 60)
        if (stage === doubleAuctionStages.BREAK) {
            // consolelog("Break");
            const breakTimeout = setTimeout(() => {
                dispatch({ type: reducerActions.NEXT_PHASE });
                setStage(doubleAuctionStages.AUCTION);
                setSocketData({ minPrice: "-", maxPrice: "-" });
                setMatched(false);
                clearTimeout(breakTimeout);
            }, 5000);
        }
    }, [stage, data.timer])

    // Timer
    useEffect(() => {
        // consolelog("setInterval");
        const interval = setInterval(() => { if (timer) { setTimer(timer - 1) } }, 1000);

        if (timer <= 0) {
            // consolelog("timer", timer)
            setTimer(data.timer * 60)
            setStage(doubleAuctionStages.BREAK);
        }

        return () => {
            clearInterval(interval);
        }
    });

    const viewData = { ...data, socketData: socketData, matched: matched };

    switch (stage) {
        case doubleAuctionStages.AUCTION:
            if (data.type === "seller") { return <SellerAuctionScreen data={viewData} timer={timer} /> }
            else if (data.type === "buyer") { return <BuyerAuctionScreen data={viewData} timer={timer} /> }
            else { return <BlankScreen lineNumber="011" /> }

        case doubleAuctionStages.BREAK:
            return <LoadingComponent className='child' />

        default:
            return <BlankScreen lineNumber="010" />
    }
}

const postedOfferStages = {
    POST_PRICE: "POST_PRICE",
    FLASH_SALE: "FLASH_SALE",
}
function POHandler({ data, dispatch }) {
    const [sellers, setSellers] = useState({});
    const [countSold, setCountSold] = useState(0);
    const [stage, setStage] = useState(postedOfferStages.POST_PRICE);
    const [timer, setTimer] = useState(data.timer * 60);

    // eventListener
    useEffect(() => {
        // consolelog("eventListener")
        function postedOfferListHandler(res) {
            // consolelog("eventListener", "postedOfferListHandler", res)
            let count = 0;
            const temp = res.map((item, i) => {
                count = (item.isSold) ? (count + 1) : count;
                return {
                    sellerId: item.sellerId,
                    role: "Penjual " + (i + 1),
                    price: item.price,
                    status: (item.isSold) ? "done" : "",
                    postedOfferId: item.id
                }
            })
            setSellers(temp)
            setCountSold(count)
        }
        socket.on("postedOfferList", postedOfferListHandler);

        function isDonePOHandler(res) {
            // consolelog("eventListener", "isDonePOHandler", res)
            if (res) { setStage(postedOfferStages.FLASH_SALE); }
        }
        socket.on("po:isDone", isDonePOHandler);

        return () => {
            // consolelog("eventListener", "refresh");
            socket.off("postedOfferList");
            socket.off("po:isDone");
        }
    }, [])

    // resetTimer
    useEffect(() => {
        // consolelog("resetTimer");
        setTimer(data.timer * 60)
    }, [stage, data.timer])

    useEffect(() => {
        // consolelog("setInterval");
        const interval = setInterval(() => { if (timer) { setTimer(timer - 1) } }, 1000);

        if (timer <= 0 || (countSold === parseInt(data.participantNumber / 2))) {
            setCountSold(0);
            setTimer(data.timer * 60)
            dispatch({ type: reducerActions.NEXT_PHASE });
            setStage(postedOfferStages.POST_PRICE);
        }

        return () => {
            clearInterval(interval);
        }
    }, [countSold, data.participantNumber, dispatch, timer]);

    switch (stage) {
        case postedOfferStages.POST_PRICE:
            if (data.type === "seller") { return <PostPriceScreen data={{ ...data, seller: sellers }} timer={timer} /> }
            else if (data.type === "buyer") { return <BuyerIdleScreen data={{ ...data, seller: sellers }} timer={timer} /> }
            else { return <BlankScreen lineNumber="021" /> }

        case postedOfferStages.FLASH_SALE:
            if (data.type === "seller") { return <SellerIdleScreen data={{ ...data, seller: sellers }} timer={timer} /> }
            else if (data.type === "buyer") { return <FlashSaleScreen data={{ ...data, seller: sellers }} timer={timer} /> }
            else { return <BlankScreen lineNumber="022" /> }

        default:
            return <BlankScreen lineNumber="020" />
    }
}


const decentralizedStages = {
    POST_PRICE: "POST_PRICE",
    FLASH_SALE: "FLASH_SALE",
}
function DSHandler({ data, dispatch }) {
    const [sellers, setSellers] = useState({});
    const [countSold, setCountSold] = useState(0);
    const [stage, setStage] = useState(decentralizedStages.POST_PRICE);
    const [timer, setTimer] = useState(data.timer * 60);

    // eventListener
    useEffect(() => {
        function decentralizedListHandler(res) {
            let count = 0;
            const temp = res.map((item, i) => {
                count = (item.isSold) ? (count + 1) : count;
                return {
                    sellerId: item.sellerId,
                    role: "Penjual " + (i + 1),
                    price: item.price,
                    status: (item.isSold) ? "done" : "",
                    decentralizedId: item.id
                }
            })
            setSellers(temp)
            setCountSold(count)
        }
        socket.on("decentralizedList", decentralizedListHandler);

        function isDoneDSHandler(res) {
            if (res) { setStage(decentralizedStages.FLASH_SALE); }
        }
        socket.on("ds:isDone", isDoneDSHandler);

        return () => {
            socket.off("decentralizedList");
            socket.off("ds:isDone");
        }
    }, [])

    // resetTimer
    useEffect(() => {
        setTimer(data.timer * 60)
    }, [stage, data.timer])

    useEffect(() => {
        const interval = setInterval(() => { if (timer) { setTimer(timer - 1) } }, 1000);

        if (timer <= 0 || (countSold === parseInt(data.participantNumber / 2))) {
            setCountSold(0);
            setTimer(data.timer * 60)
            dispatch({ type: reducerActions.NEXT_PHASE });
            setStage(decentralizedStages.POST_PRICE);
        }

        return () => {
            clearInterval(interval);
        }
    });

    switch (stage) {
        case decentralizedStages.POST_PRICE:
            if (data.type === "seller") { return <PostPriceDS data={{ ...data, seller: sellers }} timer={timer} /> }
            else if (data.type === "buyer") { return <BuyerIdleDS data={{ ...data, seller: sellers }} timer={timer} /> }
            else { return <BlankScreen lineNumber="031" /> }

        case decentralizedStages.FLASH_SALE:
            if (data.type === "seller") { return <SellerIdleDS data={{ ...data, seller: sellers }} timer={timer} /> }
            else if (data.type === "buyer") { return <ShopHandler data={{ ...data, seller: sellers }} timer={timer} /> }
            else { return <BlankScreen lineNumber="032" /> }

        default:
            return <BlankScreen lineNumber="030" />
    }
}