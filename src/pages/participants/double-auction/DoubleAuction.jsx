import { useEffect, useState, useMemo } from 'react';
import { Button, Container, Form, Image } from 'react-bootstrap'
import socket from "../../../adapters/SocketIO";
import { imgURL } from '../../../adapters/serverURL';
import Label from '../../../components/Label'
import { capitalize, displayPrice } from '../../../Utils'
import Timer from '../../../components/Timer';
import { useCallback } from 'react';

export function SellerAuctionScreen({ data, timer, phaseContinue }) {
    const [resData, setResData] = useState({ isDone: false, phaseId: false });
    const [inputPrice, setInputPrice] = useState(0);
    const [socketData, setSocketData] = useState({ minPrice: "-", maxPrice: "-" });
    const [matched, setMatched] = useState(false);
    const [profit, setProfit] = useState(0);
    const currentPhase = useMemo(() => ({ ...data.currentPhase }), [data.currentPhase]);

    // tiap saat
    useEffect(() => {
        socket.emit("da:isDone", { phaseId: currentPhase.id });
        socket.on("da:isDone", res => {
            if (res.phaseId === currentPhase.id) {
                setResData(res)
            }
        })

        socket.on("doubleAuctionList", res => {
            setSocketData({
                minPrice: displayPrice(res.minPrice, currentPhase.phaseType),
                maxPrice: displayPrice(res.maxPrice, currentPhase.phaseType)
            });
        });

        return () => {
            socket.off("da:isDone")
            socket.off("doubleAuctionList")
        }
    })

    // timer
    useEffect(() => {
        if (timer <= 0) {
            setResData({ isDone: true, phaseId: currentPhase.id })
        }
    }, [currentPhase, timer])

    // sekali listen
    useEffect(() => {
        socket.on("bidMatch", res => {
            if (res.match) {
                setMatched(true)
                setProfit(res.transaction.price - data.unitCost)
                socket.off("bidMatch")
            }
        });
    }, [data.unitCost])

    const cleanUp = useCallback(() => {
        setResData({ isDone: false, phaseId: false });
        setInputPrice(0);
        setSocketData({ minPrice: "-", maxPrice: "-" });
        setMatched(false);
        console.log(profit);
        phaseContinue(profit);
    }, [profit]);

    // tiap resdata berubah
    useEffect(() => {
        if (resData.isDone && resData.phaseId === currentPhase.id) {
            cleanUp()
        }
    }, [resData, cleanUp, currentPhase]);

    function submitHandler(e) {
        e.preventDefault();
        socket.emit("da:postSeller", {
            sellerBargain: Number(inputPrice),
            phaseId: currentPhase.id
        });
    }

    return (
        <Container className='text-center d-flex flex-column'>
            <Timer minutes={timer} />
            <section className='row my-5 py-5 border rounded-pill'>
                <div className="col-md-4">
                    <p>Offer</p>
                    <h1 className='text-primary fw-bolder'>{socketData.minPrice}</h1>
                </div>
                <div className="col-md-4">
                    <p><span className='fw-bolder'>Unit Cost</span> anda</p>
                    <h1 className='text-primary fw-bolder'>{displayPrice(data.unitCost, currentPhase.phaseType)}</h1>
                </div>
                <div className="col-md-4">
                    <p>Bid</p>
                    <h1 className='text-primary fw-bolder'>{socketData.maxPrice}</h1>
                </div>
            </section>

            <Image src={(data.goodsPic) ? imgURL + data.goodsPic : ''} fluid alt={data.goodsType} className='mx-auto' style={{ height: "360px" }} />
            {matched ?
                <p>menunggu partisipan lain...</p>
                :
                <Form onSubmit={submitHandler} className='mb-5'>
                    <Form.Group controlId="inputHarga">
                        <Form.Label className='mb-3'>Masukkan <span className='fw-bolder'>harga kesepakatan</span> yang ingin anda ajukan</Form.Label>
                        {(currentPhase.phaseType !== "postRedenomPrice") ?
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

export function BuyerAuctionScreen({ data, timer, phaseContinue }) {
    const [resData, setResData] = useState({ isDone: false, phaseId: false });
    const [inputPrice, setInputPrice] = useState(0);
    const [socketData, setSocketData] = useState({ minPrice: "-", maxPrice: "-" });
    const [matched, setMatched] = useState(false);
    const [profit, setProfit] = useState(0);
    const currentPhase = useMemo(() => ({ ...data.currentPhase }), [data.currentPhase]);

    // tiap saat
    useEffect(() => {
        socket.emit("da:isDone", { phaseId: currentPhase.id });
        socket.on("da:isDone", res => {
            if (res.phaseId === currentPhase.id) {
                setResData(res)
            }
        })

        socket.on("doubleAuctionList", res => {
            setSocketData({
                minPrice: displayPrice(res.minPrice, currentPhase.phaseType),
                maxPrice: displayPrice(res.maxPrice, currentPhase.phaseType)
            });
        });

        return () => {
            socket.off("da:isDone")
            socket.off("doubleAuctionList")
        }
    })

    // timer
    useEffect(() => {
        if (timer <= 0) {
            setResData({ isDone: true, phaseId: currentPhase.id })
        }
    }, [currentPhase, timer])

    // sekali listen
    useEffect(() => {
        socket.on("bidMatch", res => {
            if (res.match) {
                setMatched(true)
                setProfit(data.unitValue - res.transaction.price)
                socket.off("bidMatch")
            }
        });
    }, [data.unitValue])

    const cleanUp = useCallback(() => {
        setResData({ isDone: false, phaseId: false });
        setInputPrice(0);
        setSocketData({ minPrice: "-", maxPrice: "-" });
        setMatched(false);
        console.log(profit);
        phaseContinue(profit);
    }, [profit]);

    // tiap resdata berubah
    useEffect(() => {
        if (resData.isDone && resData.phaseId === currentPhase.id) {
            cleanUp()
        }
    }, [resData, cleanUp, currentPhase]);

    function submitHandler(e) {
        e.preventDefault();
        socket.emit("da:postBuyer", {
            buyerBargain: Number(inputPrice),
            phaseId: currentPhase.id
        });
    }

    return (
        <Container className='text-center d-flex flex-column'>
            <Timer minutes={timer} />
            <section className='row my-5 py-5 border rounded-pill'>
                <div className="col-md-4">
                    <p>Offer</p>
                    <h1 className='text-primary fw-bolder'>{socketData.minPrice}</h1>
                </div>
                <div className="col-md-4">
                    <p><span className='fw-bolder'>Unit Value</span> anda</p>
                    <h1 className='text-primary fw-bolder'>{displayPrice(data.unitValue, currentPhase.phaseType)}</h1>
                </div>
                <div className="col-md-4">
                    <p>Bid</p>
                    <h1 className='text-primary fw-bolder'>{socketData.maxPrice}</h1>
                </div>
            </section>

            <Image src={(data.goodsPic) ? imgURL + data.goodsPic : ''} fluid alt={data.goodsType} className='mx-auto' style={{ height: "360px" }} />
            {matched ?
                <p>menunggu partisipan lain...</p>
                :
                <Form onSubmit={submitHandler} className='mb-5'>
                    <Form.Group controlId="inputHarga">
                        <Form.Label className='mb-3'>Masukkan <span className='fw-bolder'>harga kesepakatan</span> yang ingin anda ajukan</Form.Label>
                        {(currentPhase.phaseType !== "postRedenomPrice") ?
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