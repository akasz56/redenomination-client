import { useState, useEffect, useReducer, useMemo } from "react";
import socket from "../../adapters/SocketIO";
import { capitalize, isEmptyObject, printLog, sortPhases } from "../../Utils";
import BlankScreen from "./BlankScreen";
import { participantStage } from "./Participants";
import { BuyerIdleDS, ShopHandler } from "./decentralized/Buyer";
import { PostPriceDS, SellerIdleDS } from "./decentralized/Seller";
import { BuyerIdleScreen, FlashSaleScreen } from "./posted-offer/Buyer";
import { PostPriceScreen, SellerIdleScreen } from "./posted-offer/Seller";
import BuyerAuctionScreen from "./double-auction/Buyer";
import SellerAuctionScreen from "./double-auction/Seller";
import LoadingComponent from "../../components/Loading";
import { Button, Modal } from "react-bootstrap";
import dayjs from "dayjs";

const simulationType = {
  PO: "Posted Offer",
  DA: "Double Auction",
  DS: "Decentralized",
};

const phaseName = [
  "Pre-Redenominasi",
  "Transisi Redenominasi",
  "Pasca Redenominasi",
];

const reducerActions = {
  NEXT_PHASE: "NEXT_PHASE",
  UPDATE_PHASE: "UPDATE_PHASE",
  CONTINUE_PHASE: "CONTINUE_PHASE",
  CHECK_PHASE: "CHECK_PHASE",
};

export default function PhaseHandler({ data, setStateStage }) {
  const initialState = {
    phases: sortPhases(data.phases),
    currentPhase: sortPhases(data.phases)[0],
    currentPhaseIndex: 0,
  };

  function reducer(prevState, action) {
    switch (action.type) {
      case reducerActions.NEXT_PHASE:
        socket.emit("finishPhase", { phaseId: prevState.currentPhase.id });
        const nextIndex = prevState.currentPhaseIndex + 1;
        if (nextIndex >= 3) {
          setStateStage(participantStage.COMPLETE);
          return prevState;
        } else {
          socket.emit("startPhase", {
            phaseId: prevState.phases[nextIndex].id,
          });
          return {
            ...prevState,
            currentPhase: {
              ...prevState.phases[nextIndex],
              phaseName: phaseName[nextIndex],
            },
            currentPhaseIndex: nextIndex,
          };
        }

      case reducerActions.UPDATE_PHASE:
        socket.emit("updatePhase", { phaseId: prevState.currentPhase.id });
        return prevState;

      case reducerActions.CHECK_PHASE:
        const indexExist = prevState.phases.findIndex(
          (item) => item.id === data.sessionData.phaseId
        );
        if (indexExist !== -1) {
          return {
            ...prevState,
            currentPhase: {
              ...prevState.phases[indexExist],
              phaseName: phaseName[indexExist],
            },
            currentPhaseIndex: indexExist,
          };
        } else {
          socket.emit("startPhase", { phaseId: prevState.phases[0].id });
          return {
            ...prevState,
            currentPhase: { ...prevState.phases[0], phaseName: phaseName[0] },
            currentPhaseIndex: 0,
          };
        }

      default:
        printLog("unhandled phase reduce");
        return prevState;
    }
  }
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    dispatch({ type: reducerActions.CHECK_PHASE });
  }, [data.sessionData]);

  switch (capitalize(data.simulationType)) {
    case simulationType.DA:
      return <DAHandler data={{ ...data, ...state }} dispatch={dispatch} />;
    case simulationType.PO:
      return <POHandler data={{ ...data, ...state }} dispatch={dispatch} />;
    case simulationType.DS:
      return <DSHandler data={{ ...data, ...state }} dispatch={dispatch} />;

    default:
      return <BlankScreen lineNumber="001" />;
  }
}

const doubleAuctionStages = {
  AUCTION: "AUCTION",
  BREAK: "BREAK",
};
function DAHandler({ data, dispatch }) {
  const time = useMemo(() => data.timer, [data.timer]);
  const [matched, setMatched] = useState(false);
  const [socketData, setSocketData] = useState(false);
  const [stage, setStage] = useState(doubleAuctionStages.AUCTION);
  const [showModal, setShowModal] = useState(false);

  // updateSessionData
  const startTime = useMemo(
    () => data.sessionData.startTime,
    [data.sessionData.startTime]
  );
  const [timer, setTimer] = useState(
    dayjs(startTime).add(time, "minute").diff(dayjs(), "second")
  );

  useEffect(() => {
    if (data.sessionData.stageCode === false) {
      setStage(doubleAuctionStages.AUCTION);
    } else if (data.sessionData.stageCode === true) {
      setStage(doubleAuctionStages.BREAK);
    }
  }, [data.sessionData.stageCode, timer]);

  // phaseCleanup
  const phaseId = useMemo(() => {
    setTimer(60);
    setMatched(false);
    setSocketData(false);
    return data.sessionData.phaseId;
  }, [data.sessionData.phaseId]);

  // eventListener
  useEffect(() => {
    function doubleAuctionListHandler(res) {
      setSocketData({ bid: res.bid, offer: res.offer });
    }
    socket.on("doubleAuctionList", doubleAuctionListHandler);

    function bidMatchHandler(res) {
      setShowModal(true);
      setMatched(true);
    }
    socket.on("bidMatch", bidMatchHandler);

    return () => {
      socket.off("doubleAuctionList", doubleAuctionListHandler);
      socket.off("bidMatch", bidMatchHandler);
    };
  }, []);

  // timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer(dayjs(startTime).add(time, "minute").diff(dayjs(), "second"));
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [timer, startTime, time]);

  // updatePhase
  useEffect(() => {
    function updatePhase() {
      dispatch({ type: reducerActions.NEXT_PHASE });
      setStage(doubleAuctionStages.BREAK);
      const breakTimeout = setTimeout(() => {
        setStage(doubleAuctionStages.AUCTION);
        clearTimeout(breakTimeout);
      }, 5000);
    }

    function isDoneDAHandler(res) {
      updatePhase();
    }
    socket.on("da:isDone", isDoneDAHandler);

    if (timer <= 0) {
      setTimer(60);
      updatePhase();
    }

    return () => {
      socket.off("da:isDone", isDoneDAHandler);
    };
  }, [timer, dispatch]);

  // notification Modal
  useEffect(() => {
    if (showModal) {
      const notifTimeout = setTimeout(() => {
        setShowModal(false);
        clearTimeout(notifTimeout);
      }, 3000);
    }
  }, [showModal]);

  const viewData = { ...data, socketData: socketData, matched: matched };
  switch (stage) {
    case doubleAuctionStages.AUCTION:
      if (data.type === "seller") {
        return (
          <>
            <SellerAuctionScreen data={viewData} timer={timer} />
            {showModal ? (
              <NotificationModal
                showModal={showModal}
                setShowModal={setShowModal}
              />
            ) : (
              ""
            )}
          </>
        );
      } else if (data.type === "buyer") {
        return (
          <>
            <BuyerAuctionScreen data={viewData} timer={timer} />
            {showModal ? (
              <NotificationModal
                showModal={showModal}
                setShowModal={setShowModal}
              />
            ) : (
              ""
            )}
          </>
        );
      } else {
        return <BlankScreen lineNumber="011" />;
      }

    case doubleAuctionStages.BREAK:
      return (
        <>
          <LoadingComponent className="child" />
          {showModal ? (
            <NotificationModal
              showModal={showModal}
              setShowModal={setShowModal}
            />
          ) : (
            ""
          )}
        </>
      );

    default:
      return <BlankScreen lineNumber="010" />;
  }
}

const postedOfferStages = {
  POST_PRICE: "POST_PRICE",
  FLASH_SALE: "FLASH_SALE",
};
function POHandler({ data, dispatch }) {
  const time = useMemo(() => data.timer, [data.timer]);
  const [sellers, setSellers] = useState({});
  const [countSold, setCountSold] = useState(0);
  const [stage, setStage] = useState(postedOfferStages.POST_PRICE);

  // updateSessionData
  const startTime = useMemo(
    () => data.sessionData.startTime,
    [data.sessionData.startTime]
  );
  const [timer, setTimer] = useState(
    dayjs(startTime).add(time, "minute").diff(dayjs(), "second")
  );

  useEffect(() => {
    if (data.sessionData.stageCode === false) {
      setStage(postedOfferStages.POST_PRICE);
    } else if (data.sessionData.stageCode === true) {
      setStage(postedOfferStages.FLASH_SALE);
    }
  }, [data.sessionData.stageCode, timer]);

  // phaseCleanup
  const phaseId = useMemo(() => {
    setTimer(60);
    setSellers({});
    setCountSold(0);
    setStage(postedOfferStages.POST_PRICE);
    return data.currentPhase.id;
  }, [data.currentPhase.id]);

  // eventListeners
  useEffect(() => {
    function postedOfferListHandler(res) {
      if (!isEmptyObject(res)) {
        let count = 0;
        setSellers(
          res.map((item, i) => {
            count = item.isSold ? count + 1 : count;
            return {
              sellerId: item.sellerId,
              buyerId: item.buyerId,
              role: "Penjual " + (i + 1),
              price: item.price,
              status: item.isSold ? "done" : "",
              postedOfferId: item.id,
            };
          })
        );
        setCountSold(count);
      }
    }
    socket.on("postedOfferList", postedOfferListHandler);

    return () => {
      socket.off("postedOfferList", postedOfferListHandler);
    };
  }, []);

  // timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer(dayjs(startTime).add(time, "minute").diff(dayjs(), "second"));
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [timer, startTime, time]);

  useEffect(() => {
    if (stage === postedOfferStages.FLASH_SALE) {
      if (countSold === parseInt(data.participantNumber / 2)) {
        dispatch({ type: reducerActions.NEXT_PHASE });
      } else if (timer <= 0) {
        dispatch({ type: reducerActions.NEXT_PHASE });
      }
    } else if (stage === postedOfferStages.POST_PRICE) {
      if (timer <= 0) {
        dispatch({ type: reducerActions.UPDATE_PHASE });
        setTimer(60);
        setStage(postedOfferStages.FLASH_SALE);
      }
    }
  }, [stage, timer, countSold, data, dispatch]);

  switch (stage) {
    case postedOfferStages.POST_PRICE:
      if (data.type === "seller") {
        return (
          <PostPriceScreen data={{ ...data, seller: sellers }} timer={timer} />
        );
      } else if (data.type === "buyer") {
        return (
          <BuyerIdleScreen data={{ ...data, seller: sellers }} timer={timer} />
        );
      } else {
        return <BlankScreen lineNumber="021" />;
      }

    case postedOfferStages.FLASH_SALE:
      if (data.type === "seller") {
        return (
          <SellerIdleScreen data={{ ...data, seller: sellers }} timer={timer} />
        );
      } else if (data.type === "buyer") {
        return (
          <FlashSaleScreen data={{ ...data, seller: sellers }} timer={timer} />
        );
      } else {
        return <BlankScreen lineNumber="022" />;
      }

    default:
      return <BlankScreen lineNumber="020" />;
  }
}

const decentralizedStages = {
  POST_PRICE: "POST_PRICE",
  FLASH_SALE: "FLASH_SALE",
};
function DSHandler({ data, dispatch }) {
  const time = useMemo(() => data.timer, [data.timer]);
  const [sellers, setSellers] = useState({});
  const [countSold, setCountSold] = useState(0);
  const [stage, setStage] = useState(decentralizedStages.POST_PRICE);

  // updateSessionData
  const startTime = useMemo(
    () => data.sessionData.startTime,
    [data.sessionData.startTime]
  );
  const [timer, setTimer] = useState(
    dayjs(startTime).add(time, "minute").diff(dayjs(), "second")
  );

  useEffect(() => {
    if (data.sessionData.stageCode === false) {
      setStage(decentralizedStages.POST_PRICE);
    } else if (data.sessionData.stageCode === true) {
      setStage(decentralizedStages.FLASH_SALE);
    }
  }, [data.sessionData.stageCode, timer]);

  // phaseCleanup
  const phaseId = useMemo(() => {
    setTimer(60);
    setSellers({});
    setCountSold(0);
    setStage(decentralizedStages.POST_PRICE);
    return data.currentPhase.id;
  }, [data.currentPhase.id]);

  // eventListeners
  useEffect(() => {
    function decentralizedListHandler(res) {
      if (!isEmptyObject(res)) {
        let count = 0;
        setSellers(
          res.map((item, i) => {
            count = item.isSold ? count + 1 : count;
            return {
              sellerId: item.sellerId,
              buyerId: item.buyerId,
              role: "Penjual " + (i + 1),
              price: item.price,
              status: item.isSold,
              decentralizedId: item.id,
            };
          })
        );
        setCountSold(count);
      }
    }
    socket.on("decentralizedList", decentralizedListHandler);

    return () => {
      socket.off("decentralizedList", decentralizedListHandler);
    };
  }, []);

  // timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer(dayjs(startTime).add(time, "minute").diff(dayjs(), "second"));
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [timer, startTime, time]);

  useEffect(() => {
    if (stage === decentralizedStages.FLASH_SALE) {
      if (countSold === parseInt(data.participantNumber / 2)) {
        dispatch({ type: reducerActions.NEXT_PHASE });
      } else if (timer <= 0) {
        dispatch({ type: reducerActions.NEXT_PHASE });
      }
    } else if (stage === decentralizedStages.POST_PRICE) {
      if (timer <= 0) {
        dispatch({ type: reducerActions.UPDATE_PHASE });
        setTimer(60);
        setStage(decentralizedStages.FLASH_SALE);
      }
    }
  }, [stage, timer, countSold, data, dispatch]);

  switch (stage) {
    case decentralizedStages.POST_PRICE:
      if (data.type === "seller") {
        return (
          <PostPriceDS data={{ ...data, seller: sellers }} timer={timer} />
        );
      } else if (data.type === "buyer") {
        return (
          <BuyerIdleDS data={{ ...data, seller: sellers }} timer={timer} />
        );
      } else {
        return <BlankScreen lineNumber="031" />;
      }

    case decentralizedStages.FLASH_SALE:
      if (data.type === "seller") {
        return (
          <SellerIdleDS data={{ ...data, seller: sellers }} timer={timer} />
        );
      } else if (data.type === "buyer") {
        return (
          <ShopHandler data={{ ...data, seller: sellers }} timer={timer} />
        );
      } else {
        return <BlankScreen lineNumber="032" />;
      }

    default:
      return <BlankScreen lineNumber="030" />;
  }
}

// Extras
function NotificationModal({ showModal, setShowModal }) {
  return (
    <Modal
      show={showModal}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title>Notifikasi</Modal.Title>
      </Modal.Header>
      <Modal.Body>Terdapat match harga</Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={() => {
            setShowModal(false);
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
