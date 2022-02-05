import { useEffect, useState } from 'react';
import { Button, Container, Form, Image } from 'react-bootstrap'
import socket from "../../../adapters/SocketIO";
import { imgURL } from '../../../adapters/serverURL';
import Label from '../../../components/Label'
import { capitalize, displayPrice } from '../../../Utils'

export function SellerAuctionScreen({ data, phaseContinue }) {
    const [resData, setResData] = useState({ isDone: false, phaseId: false });
    const [inputPrice, setInputPrice] = useState(0);
    const [socketData, setSocketData] = useState({ minPrice: "-", maxPrice: "-" });
    const [matched, setMatched] = useState(false);
    const [profit, setProfit] = useState(0);

    useEffect(() => {
        if (matched) {
            socket.emit("da:isDone", { phaseId: data.currentPhase.id });
            socket.on("da:isDone", res => {
                setResData(res)
            })
        }

        socket.on("doubleAuctionList", res => {
            setSocketData({
                minPrice: displayPrice(res.minPrice, data.currentPhase.phaseType),
                maxPrice: displayPrice(res.maxPrice, data.currentPhase.phaseType)
            });
        });

        return () => {
            socket.off("da:isDone")
            socket.off("doubleAuctionList")
        }
    })

    useEffect(() => {
        if (resData.isDone && resData.phaseId === data.currentPhase.id) {
            console.log("pass1");
            setResData({ isDone: false, phaseId: false });
            phaseContinue(profit);
            setInputPrice(0);
            setSocketData({ minPrice: "-", maxPrice: "-" });
            setMatched(false);
            setProfit(0);
        }
    }, [resData]);

    function submitHandler(e) {
        e.preventDefault();
        socket.emit("da:postSeller", {
            sellerBargain: Number(inputPrice),
            phaseId: data.currentPhase.id
        });

        socket.on("bidMatch", res => {
            if (res.match) {
                setMatched(true)
                setProfit(res.transaction.price - data.unitCost)
                socket.off("bidMatch")
            }
        });
    }

    return (
        <Container className='text-center d-flex flex-column'>
            <section className='row my-5 py-5 border rounded-pill'>
                <div className="col-md-4">
                    <p>Offer</p>
                    <h1 className='text-primary fw-bolder'>{socketData.minPrice}</h1>
                </div>
                <div className="col-md-4">
                    <p><span className='fw-bolder'>Unit Cost</span> anda</p>
                    <h1 className='text-primary fw-bolder'>{displayPrice(data.unitCost, data.currentPhase.phaseType)}</h1>
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

export function BuyerAuctionScreen({ data, phaseContinue }) {
    const [resData, setResData] = useState({ isDone: false, phaseId: false });
    const [inputPrice, setInputPrice] = useState(0);
    const [socketData, setSocketData] = useState({ minPrice: "-", maxPrice: "-" });
    const [matched, setMatched] = useState(false);
    const [profit, setProfit] = useState(0);

    useEffect(() => {
        if (matched) {
            socket.emit("da:isDone", { phaseId: data.currentPhase.id });
            socket.on("da:isDone", res => {
                setResData(res)
            })
        }

        socket.on("doubleAuctionList", res => {
            setSocketData({
                minPrice: displayPrice(res.minPrice, data.currentPhase.phaseType),
                maxPrice: displayPrice(res.maxPrice, data.currentPhase.phaseType)
            });
        });

        return () => {
            socket.off("da:isDone")
            socket.off("doubleAuctionList")
        }
    })

    useEffect(() => {
        if (resData.isDone && resData.phaseId === data.currentPhase.id) {
            console.log("pass1");
            setResData({ isDone: false, phaseId: false });
            phaseContinue(profit);
            setInputPrice(0);
            setSocketData({ minPrice: "-", maxPrice: "-" });
            setMatched(false);
            setProfit(0);
        }
    }, [resData]);

    function submitHandler(e) {
        e.preventDefault();
        socket.emit("da:postBuyer", {
            buyerBargain: Number(inputPrice),
            phaseId: data.currentPhase.id
        });

        socket.on("bidMatch", res => {
            if (res.match) {
                setMatched(true)
                setProfit(data.unitValue - res.transaction.price)
                socket.off("bidMatch")
            }
        });
    }

    return (
        <Container className='text-center d-flex flex-column'>
            <section className='row my-5 py-5 border rounded-pill'>
                <div className="col-md-4">
                    <p>Offer</p>
                    <h1 className='text-primary fw-bolder'>{socketData.minPrice}</h1>
                </div>
                <div className="col-md-4">
                    <p><span className='fw-bolder'>Unit Value</span> anda</p>
                    <h1 className='text-primary fw-bolder'>{displayPrice(data.unitValue, data.currentPhase.phaseType)}</h1>
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