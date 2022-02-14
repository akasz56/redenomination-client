import { useEffect, useState, useReducer } from 'react';
import { Button, Container, Form, Image, Modal } from 'react-bootstrap'
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
        case RED_ACT.BID_MATCH:
            return { ...prevState, matched: true, profit: prevState.unitValue - action.payload };

        case RED_ACT.PHASE_DONE:
            return {
                ...initialState,
                unitValue: prevState.unitValue,
                waitBreak: false
            };

        case RED_ACT.BREAK:
            return {
                ...prevState,
                unitValue: prevState.unitValue,
                waitBreak: true
            };

        case RED_ACT.UPDATE_SOCKET:
            return { ...prevState, socketData: action.payload };

        default:
            console.log("unhandled reduce")
            return prevState;
    }
}

function sellerReducer(prevState, action) {
    switch (action.type) {
        case RED_ACT.BID_MATCH:
            return { ...prevState, matched: true, profit: action.payload - prevState.unitCost };

        case RED_ACT.PHASE_DONE:
            return {
                ...initialState,
                unitCost: prevState.unitCost,
                waitBreak: false
            };

        case RED_ACT.BREAK:
            return {
                ...prevState,
                unitCost: prevState.unitCost,
                waitBreak: true
            };

        case RED_ACT.UPDATE_SOCKET:
            return { ...prevState, socketData: action.payload };

        default:
            console.log("unhandled reduce")
            return prevState;
    }
}


export function SellerAuctionScreen({ data, timer, phaseContinue }) {
    const [inputPrice, setInputPrice] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [currentState, dispatch] = useReducer(sellerReducer, {
        ...initialState,
        unitCost: data.unitCost
    });

    // socket listen
    useEffect(() => {
        socket.on("da:isDone", res => {
            console.log("da:isDone", res)
            dispatch({ type: RED_ACT.BREAK })
        })

        socket.on("doubleAuctionList", res => {
            console.log("doubleAuctionList", res)
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
    }, [data.currentPhase.phaseType])

    // timer
    useEffect(() => {
        if (timer <= 0) {
            dispatch({ type: RED_ACT.BREAK })
        }
    })

    // Break Function
    useEffect(() => {
        if (currentState.waitBreak) {
            const breakTimeout = setTimeout(() => {
                phaseContinue(currentState.profit)
                dispatch({ type: RED_ACT.PHASE_DONE })
                clearTimeout(breakTimeout);
            }, 5000);
        }
    }, [currentState.waitBreak, currentState.profit, phaseContinue])

    useEffect(() => {
        if (showModal) {
            const notifTimeout = setTimeout(() => {
                setShowModal(false)
                clearTimeout(notifTimeout);
            }, 3000);
        }
    }, [showModal])

    function submitHandler(e) {
        e.preventDefault();
        socket.emit("da:postSeller", {
            sellerBargain: parseInt(inputPrice),
            phaseId: data.currentPhase.id
        });

        socket.once("bidMatch", res => {
            console.log("bidMatch")
            setShowModal(true)
            dispatch({ type: RED_ACT.BID_MATCH, payload: res.transaction.price })
        });
    }

    if (currentState.waitBreak) return (<>
        <LoadingComponent className='child' />

        <Modal show={showModal} aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header>
                <Modal.Title>Notifikasi</Modal.Title>
            </Modal.Header>
            <Modal.Body>Terdapat match harga dengan Penjual</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => { setShowModal(false) }}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    </>)
    else {
        return (
            <Container className='text-center d-flex flex-column'>
                <Timer minutes={timer} />
                <section className='row my-5 py-5 border rounded-pill'>
                    <div className="col-md-4">
                        <p>Bid</p>
                        <h1 className='text-primary fw-bolder'>{currentState.socketData.minPrice}</h1>
                    </div>
                    <div className="col-md-4">
                        <p><span className='fw-bolder'>Unit Cost</span> anda</p>
                        <h1 className='text-primary fw-bolder'>{displayPrice(data.unitCost, data.currentPhase.phaseType)}</h1>
                    </div>
                    <div className="col-md-4">
                        <p>Offer</p>
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

                <Modal show={showModal} aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Notifikasi</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Terdapat match harga dengan Pembeli</Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => { setShowModal(false) }}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

            </Container>
        )
    }
}

export function BuyerAuctionScreen({ data, timer, phaseContinue }) {
    const [inputPrice, setInputPrice] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [currentState, dispatch] = useReducer(buyerReducer, {
        ...initialState,
        unitValue: data.unitValue
    });

    // socket listen
    useEffect(() => {
        socket.on("da:isDone", res => {
            console.log("da:isDone", res)
            dispatch({ type: RED_ACT.BREAK })
        })

        socket.on("doubleAuctionList", res => {
            console.log("doubleAuctionList", res)
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
    }, [data.currentPhase.phaseType])

    // timer
    useEffect(() => {
        if (timer <= 0) {
            dispatch({ type: RED_ACT.BREAK })
        }
    })

    // Break Function
    useEffect(() => {
        if (currentState.waitBreak) {
            const breakTimeout = setTimeout(() => {
                phaseContinue(currentState.profit)
                dispatch({ type: RED_ACT.PHASE_DONE })
                clearTimeout(breakTimeout);
            }, 5000);
        }
    }, [currentState.waitBreak, currentState.profit, phaseContinue])

    useEffect(() => {
        if (showModal) {
            const notifTimeout = setTimeout(() => {
                setShowModal(false)
                clearTimeout(notifTimeout);
            }, 3000);
        }
    }, [showModal])

    function submitHandler(e) {
        e.preventDefault();
        socket.emit("da:postBuyer", {
            buyerBargain: parseInt(inputPrice),
            phaseId: data.currentPhase.id
        });

        socket.once("bidMatch", res => {
            console.log("bidMatch")
            setShowModal(true)
            dispatch({ type: RED_ACT.BID_MATCH, payload: res.transaction.price })
        });
    }

    if (currentState.waitBreak) return (<>
        <LoadingComponent className='child' />

        <Modal show={showModal} aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header>
                <Modal.Title>Notifikasi</Modal.Title>
            </Modal.Header>
            <Modal.Body>Terdapat match harga dengan Penjual</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => { setShowModal(false) }}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    </>)
    else {
        return (
            <Container className='text-center d-flex flex-column'>
                <Timer minutes={timer} />
                <section className='row my-5 py-5 border rounded-pill'>
                    <div className="col-md-4">
                        <p>Bid</p>
                        <h1 className='text-primary fw-bolder'>{currentState.socketData.minPrice}</h1>
                    </div>
                    <div className="col-md-4">
                        <p><span className='fw-bolder'>Unit Value</span> anda</p>
                        <h1 className='text-primary fw-bolder'>{displayPrice(data.unitValue, data.currentPhase.phaseType)}</h1>
                    </div>
                    <div className="col-md-4">
                        <p>Offer</p>
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

                <Modal show={showModal} aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header>
                        <Modal.Title>Notifikasi</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Terdapat match harga dengan Penjual</Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => { setShowModal(false) }}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

            </Container>
        )
    }
}