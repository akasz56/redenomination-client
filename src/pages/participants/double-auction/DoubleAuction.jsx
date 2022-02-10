import { useEffect, useState, useMemo, useReducer } from 'react';
import { Button, Container, Form, Image } from 'react-bootstrap'
import socket from "../../../adapters/SocketIO";
import { imgURL } from '../../../adapters/serverURL';
import Label from '../../../components/Label'
import Timer from '../../../components/Timer';
import { capitalize, displayPrice } from '../../../Utils'
import LoadingComponent from '../../../components/Loading';

const RED_ACT = {
    PHASE_DONE: "PHASE_DONE",
    BREAK: "BREAK",
    BID_MATCH: "BID_MATCH",
    UPDATE_SOCKET: "UPDATE_SOCKET",
}

const initialState = {
    waitBreak: false,
    socketData: { minPrice: "-", maxPrice: "-" },
    matched: false,
    profit: 0,
}

function buyerReducer(prevState, action) {
    switch (action.type) {
        case RED_ACT.PHASE_DONE:
            return {
                ...initialState,
                unitValue: prevState.unitValue,
                waitBreak: false
            };

        case RED_ACT.BREAK:
            return {
                ...initialState,
                unitValue: prevState.unitValue,
                waitBreak: true
            };

        case RED_ACT.BID_MATCH:
            return { ...prevState, matched: true, profit: prevState.unitValue - action.payload };

        case RED_ACT.UPDATE_SOCKET:
            return { ...prevState, socketData: action.payload };

        default:
            console.log("unhandled reduce")
            return prevState;
    }
}

function sellerReducer(prevState, action) {
    switch (action.type) {
        case RED_ACT.PHASE_DONE:
            return {
                ...initialState,
                unitValue: prevState.unitValue,
                waitBreak: false
            };

        case RED_ACT.BREAK:
            return {
                ...initialState,
                unitValue: prevState.unitValue,
                waitBreak: true
            };

        case RED_ACT.BID_MATCH:
            return { ...prevState, matched: true, profit: action.payload - prevState.unitCost };

        case RED_ACT.UPDATE_SOCKET:
            return { ...prevState, socketData: action.payload };

        default:
            console.log("unhandled reduce")
            return prevState;
    }
}


export function SellerAuctionScreen({ data, timer, phaseContinue }) {
    const [inputPrice, setInputPrice] = useState(0);
    const [currentState, dispatch] = useReducer(sellerReducer, {
        ...initialState,
        unitCost: data.unitCost
    });

    // tiap saat
    useEffect(() => {
        socket.emit("da:isDone", { phaseId: data.currentPhase.id });
        socket.once("da:isDone", res => {
            if (res.isDone && res.phaseId === data.currentPhase.id) {
                console.log("from res is done")
                phaseContinue(currentState.profit)
                dispatch({ type: RED_ACT.BREAK })
            }
        })

        socket.on("doubleAuctionList", res => {
            dispatch({
                type: RED_ACT.UPDATE_SOCKET,
                payload: {
                    minPrice: displayPrice(res.minPrice, data.currentPhase.phaseType),
                    maxPrice: displayPrice(res.maxPrice, data.currentPhase.phaseType)
                }
            })
        });

        return () => {
            socket.off("da:isDone")
            socket.off("doubleAuctionList")
        }
    })

    // timer
    useEffect(() => {
        if (timer <= 0) {
            phaseContinue(currentState.profit)
            dispatch({ type: RED_ACT.BREAK })
        }
    }, [timer])

    // Break Function
    useEffect(() => {
        if (currentState.waitBreak) {
            const breakTimeout = setTimeout(() => {
                dispatch({ type: RED_ACT.PHASE_DONE })
                clearTimeout(breakTimeout);
            }, 3000);
        }
    })

    function submitHandler(e) {
        e.preventDefault();
        socket.emit("da:postSeller", {
            sellerBargain: Number(inputPrice),
            phaseId: data.currentPhase.id
        });

        socket.on("bidMatch", res => {
            dispatch({ type: RED_ACT.BID_MATCH, payload: res.transaction.price })
            socket.off("bidMatch")
        });
    }

    if (currentState.waitBreak === true) return (<LoadingComponent className='child' />)
    else {
        return (
            <Container className='text-center d-flex flex-column'>
                <Timer minutes={timer} />
                <section className='row my-5 py-5 border rounded-pill'>
                    <div className="col-md-4">
                        <p>Offer</p>
                        <h1 className='text-primary fw-bolder'>{currentState.socketData.minPrice}</h1>
                    </div>
                    <div className="col-md-4">
                        <p><span className='fw-bolder'>Unit Cost</span> anda</p>
                        <h1 className='text-primary fw-bolder'>{displayPrice(data.unitCost, data.currentPhase.phaseType)}</h1>
                    </div>
                    <div className="col-md-4">
                        <p>Bid</p>
                        <h1 className='text-primary fw-bolder'>{currentState.socketData.maxPrice}</h1>
                    </div>
                </section>

                <Image src={(data.goodsPic) ? imgURL + data.goodsPic : ''} fluid alt={data.goodsType} className='mx-auto' style={{ height: "360px" }} />
                {currentState.matched ?
                    <p>menunggu partisipan lain...</p>
                    :
                    <Form onSubmit={submitHandler} className='mb-5'>
                        <Form.Group controlId="inputHarga">
                            <Form.Label className='mb-3'>Masukkan <span className='fw-bolder'>harga kesepakatan</span> yang ingin anda ajukan</Form.Label>
                            {(data.currentPhase.phaseType !== "postRedenomPrice") ?
                                <Form.Control type="number" className='text-center' defaultValue={inputPrice} required
                                    onChange={e => { setInputPrice(e.target.value) }}
                                    min={data.unitCost}
                                    placeholder={data.unitCost}
                                />
                                :
                                <Form.Control type="number" className='text-center' defaultValue={inputPrice} required
                                    onChange={e => { setInputPrice(e.target.value) }}
                                    max={10}
                                    min={data.unitCost / 1000}
                                    placeholder={data.unitCost / 1000}
                                    step={0.001}
                                />

                            }
                        </Form.Group>
                        <Button type="submit" className='mt-3 py-3 px-5 fs-4'>Tetapkan</Button>
                    </Form>
                }

                <Label
                    className="my-5 mx-auto"
                    phase={data.phaseName}
                    goods={data.goodsType + " (" + capitalize(data.goodsName) + ")"}
                    inflation={data.inflationType}
                />
            </Container>
        )
    }
}

export function BuyerAuctionScreen({ data, timer, phaseContinue }) {
    const [inputPrice, setInputPrice] = useState(0);
    const [currentState, dispatch] = useReducer(buyerReducer, {
        ...initialState,
        unitValue: data.unitValue
    });

    // tiap saat
    useEffect(() => {
        socket.emit("da:isDone", { phaseId: data.currentPhase.id });
        socket.once("da:isDone", res => {
            if (res.isDone && res.phaseId === data.currentPhase.id) {
                console.log("from res is done")
                phaseContinue(currentState.profit)
                dispatch({ type: RED_ACT.BREAK })
            }
        })

        socket.on("doubleAuctionList", res => {
            dispatch({
                type: RED_ACT.UPDATE_SOCKET,
                payload: {
                    minPrice: displayPrice(res.minPrice, data.currentPhase.phaseType),
                    maxPrice: displayPrice(res.maxPrice, data.currentPhase.phaseType)
                }
            })
        });

        return () => {
            socket.off("da:isDone")
            socket.off("doubleAuctionList")
        }
    })

    // timer
    useEffect(() => {
        if (timer <= 0) {
            phaseContinue(currentState.profit)
            dispatch({ type: RED_ACT.BREAK })
        }
    }, [timer])

    // Break Function
    useEffect(() => {
        if (currentState.waitBreak) {
            const breakTimeout = setTimeout(() => {
                dispatch({ type: RED_ACT.PHASE_DONE })
                clearTimeout(breakTimeout);
            }, 3000);
        }
    })

    function submitHandler(e) {
        e.preventDefault();
        socket.emit("da:postBuyer", {
            buyerBargain: Number(inputPrice),
            phaseId: data.currentPhase.id
        });

        socket.on("bidMatch", res => {
            dispatch({ type: RED_ACT.BID_MATCH, payload: res.transaction.price })
            socket.off("bidMatch")
        });
    }

    if (currentState.waitBreak === true) return (<LoadingComponent className='child' />)
    else {
        return (
            <Container className='text-center d-flex flex-column'>
                <Timer minutes={timer} />
                <section className='row my-5 py-5 border rounded-pill'>
                    <div className="col-md-4">
                        <p>Offer</p>
                        <h1 className='text-primary fw-bolder'>{currentState.socketData.minPrice}</h1>
                    </div>
                    <div className="col-md-4">
                        <p><span className='fw-bolder'>Unit Value</span> anda</p>
                        <h1 className='text-primary fw-bolder'>{displayPrice(data.unitValue, data.currentPhase.phaseType)}</h1>
                    </div>
                    <div className="col-md-4">
                        <p>Bid</p>
                        <h1 className='text-primary fw-bolder'>{currentState.socketData.maxPrice}</h1>
                    </div>
                </section>

                <Image src={(data.goodsPic) ? imgURL + data.goodsPic : ''} fluid alt={data.goodsType} className='mx-auto' style={{ height: "360px" }} />
                {currentState.matched ?
                    <p>menunggu partisipan lain...</p>
                    :
                    <Form onSubmit={submitHandler} className='mb-5'>
                        <Form.Group controlId="inputHarga">
                            <Form.Label className='mb-3'>Masukkan <span className='fw-bolder'>harga kesepakatan</span> yang ingin anda ajukan</Form.Label>
                            {(data.currentPhase.phaseType !== "postRedenomPrice") ?
                                <Form.Control type="number" className='text-center' defaultValue={inputPrice} required
                                    onChange={e => { setInputPrice(e.target.value) }}
                                    max={data.unitValue}
                                    min={0}
                                />
                                :
                                <Form.Control type="number" className='text-center' defaultValue={inputPrice} required
                                    onChange={e => { setInputPrice(e.target.value) }}
                                    max={data.unitValue / 1000}
                                    min={0}
                                    step={0.001}
                                />
                            }

                        </Form.Group>
                        <Button type="submit" className='mt-3 py-3 px-5 fs-4'>Tetapkan</Button>
                    </Form>
                }

                <Label
                    className="my-5 mx-auto"
                    phase={data.phaseName}
                    goods={data.goodsType + " (" + capitalize(data.goodsName) + ")"}
                    inflation={data.inflationType}
                />
            </Container>
        )
    }
}