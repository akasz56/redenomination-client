import { useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap'
import Label from '../../../components/Label'
import { adjustPrice, capitalize, displayPrice } from '../../../Utils'

export function SellerAuctionScreen({ socket, data, phaseContinue }) {
    const [inputPrice, setInputPrice] = useState(0);
    const [socketData, setSocketData] = useState({ minPrice: "-", maxPrice: "-" });
    const [status, setStatus] = useState({ matched: false, profit: 0 });
    const [isDone, setIsDone] = useState(false);

    function cleanUp() {
        setIsDone(false);
        setInputPrice(0);
        setStatus({ matched: false, profit: 0 });
        setSocketData({ minPrice: "-", maxPrice: "-" });
    }

    useEffect(() => {
        socket.on("doubleAuctionList", res => {
            if (res) {
                console.log(res)
                setSocketData({
                    minPrice: displayPrice(res.minPrice, data.currentPhase.phaseType),
                    maxPrice: displayPrice(res.maxPrice, data.currentPhase.phaseType)
                });
                if (res.TrxOccurrence * 2 >= data.participantNumber) {
                    setIsDone(true)
                }
            }
        });

        if (status.matched && isDone) {
            cleanUp();
            const myProfit = status.profit;
            phaseContinue(myProfit)
        }
    }, [status, isDone, socket, phaseContinue, data]);

    function submitHandler(e) {
        e.preventDefault();
        socket.emit("da:postSeller", {
            sellerBargain: Number(inputPrice),
            phaseId: data.currentPhase.id
        });

        socket.on("bidMatch", res => {
            setStatus({
                matched: res.match,
                profit: res.transaction.price - adjustPrice(data.unitCost, data.currentPhase.phaseType)
            });
            console.log(res.transaction.price - data.unitCost)
        });
    }

    return (
        <Container className='text-center d-flex flex-column'>
            <section className='row my-5 py-5 border rounded-pill'>
                <div className="col-md-4">
                    <p>Offer</p>
                    <h1 className='text-primary fw-bolder'>Rp. {socketData.minPrice}</h1>
                </div>
                <div className="col-md-4">
                    <p><span className='fw-bolder'>Unit Cost</span> anda</p>
                    <h1 className='text-primary fw-bolder'>Rp. {displayPrice(data.unitCost, data.currentPhase.phaseType)}</h1>
                </div>
                <div className="col-md-4">
                    <p>Bid</p>
                    <h1 className='text-primary fw-bolder'>Rp. {socketData.maxPrice}</h1>
                </div>
            </section>

            {status.matched ?
                <p>menunggu partisipan lain...</p>
                :
                <Form onSubmit={submitHandler} className='mb-5'>
                    <Form.Group controlId="inputHarga">
                        <Form.Label className='mb-3'>Masukkan <span className='fw-bolder'>harga kesepakatan</span> yang ingin anda ajukan</Form.Label>
                        {(data.currentPhase.phaseType !== "postRedenomPrice") ?
                            <Form.Control type="number" className='text-center' defaultValue={inputPrice} required
                                onChange={e => { setInputPrice(e.target.value) }}
                                min={data.unitCost}
                            />
                            :
                            <Form.Control type="number" className='text-center' defaultValue={inputPrice} required
                                onChange={e => { setInputPrice(e.target.value) }}
                                max={10}
                                min={data.unitCost / 1000}
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

export function BuyerAuctionScreen({ socket, data, phaseContinue }) {
    const [inputPrice, setInputPrice] = useState(0);
    const [socketData, setSocketData] = useState({ minPrice: "-", maxPrice: "-" });
    const [status, setStatus] = useState({ matched: false, profit: 0 });
    const [isDone, setIsDone] = useState(false);

    function cleanUp() {
        setIsDone(false);
        setInputPrice(0);
        setStatus({ matched: false, profit: 0 });
        setSocketData({ minPrice: "-", maxPrice: "-" });
    }

    useEffect(() => {
        socket.on("doubleAuctionList", res => {
            if (res) {
                console.log(res)
                setSocketData({
                    minPrice: displayPrice(res.minPrice, data.currentPhase.phaseType),
                    maxPrice: displayPrice(res.maxPrice, data.currentPhase.phaseType)
                });
                if (res.TrxOccurrence * 2 >= data.participantNumber) {
                    setIsDone(true)
                }
            }
        });

        if (status.matched && isDone) {
            cleanUp();
            const myProfit = status.profit;
            phaseContinue(myProfit)
        }
    }, [status, isDone, socket, phaseContinue, data]);

    function submitHandler(e) {
        e.preventDefault();
        socket.emit("da:postBuyer", {
            buyerBargain: Number(inputPrice),
            phaseId: data.currentPhase.id
        });

        socket.on("bidMatch", res => {
            setStatus({
                matched: res.match,
                profit: adjustPrice(data.unitValue, data.currentPhase.phaseType) - res.transaction.price
            });
            console.log(data.unitValue - res.transaction.price)
        });
    }

    return (
        <Container className='text-center d-flex flex-column'>
            <section className='row my-5 py-5 border rounded-pill'>
                <div className="col-md-4">
                    <p>Offer</p>
                    <h1 className='text-primary fw-bolder'>Rp. {socketData.minPrice}</h1>
                </div>
                <div className="col-md-4">
                    <p><span className='fw-bolder'>Unit Value</span> anda</p>
                    <h1 className='text-primary fw-bolder'>Rp. {displayPrice(data.unitValue, data.currentPhase.phaseType)}</h1>
                </div>
                <div className="col-md-4">
                    <p>Bid</p>
                    <h1 className='text-primary fw-bolder'>Rp. {socketData.maxPrice}</h1>
                </div>
            </section>

            {status.matched ?
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