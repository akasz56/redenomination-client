import { useEffect, useState } from 'react'
import { Button, Container, Form, Image } from 'react-bootstrap'
import socket from "../../../adapters/SocketIO";
import { imgURL } from '../../../adapters/serverURL'
import Card from '../../../components/Card'
import Label from '../../../components/Label'
import Timer from '../../../components/Timer';
import { capitalize, displayPrice } from '../../../Utils';

// ---------------------------------------------BUYER
export function BuyerIdleDS({ data, timer }) {
    return (
        <Container className='text-center d-flex flex-column'>
            <Timer minutes={timer} />
            <p className='mt-5'>Anda mendapat <span className='fw-bolder'>Unit Value</span> sebesar</p>
            <h1 className='mb-4 mb-xl-5 text-primary fw-bolder'>{displayPrice(data.unitValue, data.currentPhase.phaseType)}</h1>

            <Image src={(data.goodsPic) ? imgURL + data.goodsPic : ''} fluid alt={data.goodsType} className='mx-auto' style={{ height: "360px" }} />
            <p className='mt-5'>menunggu penjual memasang harga......</p>

            <Label
                className="mt-5 mx-auto"
                phase={data.phaseName}
                goods={data.goodsType + " (" + capitalize(data.goodsName) + ")"}
                inflation={data.inflationType}
            />
        </Container >
    )
}

export function Lobby({ data, timer, phaseContinue }) {
    const [seller, setSeller] = useState(data.seller);
    const [countSold, setCountSold] = useState(0);
    const [myProfit, setMyProfit] = useState(0);
    const [isInside, setIsInside] = useState(false);

    useEffect(() => {
        let count = 0;
        socket.on("decentralizedList", (res) => {
            const temp = res.map((item, i) => {
                count = (item.isSold) ? (count + 1) : count;
                return {
                    sellerId: item.sellerId,
                    role: "Penjual " + (i + 1),
                    price: item.price,
                    isSold: item.isSold,
                    decentralizedId: item.id
                }
            })
            setSeller(temp)
            setCountSold(count)
        })

        if (timer <= 0 || (countSold === (data.participantNumber / 2))) {
            phaseContinue(myProfit);
        }

        return () => {
            socket.off("decentralizedList")
        }
    })

    if (isInside) { return <EnterShop data={data} timer={timer} setIsInside={setIsInside} seller={seller.find((item) => item.decentralizedId === isInside)} setMyProfit={setMyProfit} /> }
    else { return <ListShops data={data} timer={timer} setIsInside={setIsInside} sellers={seller} /> }
}

export function ListShops({ data, timer, setIsInside, sellers }) {

    useEffect(() => {
        document.title = "Decentralized"
    })

    function clickHandler(item) {
        setIsInside(item.decentralizedId)
    }

    return (
        <Container className='text-center d-flex flex-column'>
            <Timer minutes={timer} />
            <h3 className='mt-5'>Silahkan <span className='fw-bold'>Pilih Penjual</span> untuk melihat Harga</h3>
            <section className='mt-5 d-flex justify-content-between flex-wrap'>
                {sellers.map((item, i) => (
                    <Card
                        key={i}
                        variant={(item.isSold) ? "done" : "decentralized"}
                        className="mb-3"
                        role={item.role}
                        onBtnClick={(e) => { clickHandler(item) }}
                    />
                ))}
            </section>

            <Label
                className="mt-5 mx-auto"
                phase={data.phaseName}
                goods={data.goodsType + " (" + data.goodsName + ")"}
                inflation={data.inflationType}
            />
        </Container >
    )
}

export function EnterShop({ data, timer, setIsInside, seller, setMyProfit }) {
    const [status, setStatus] = useState(false);

    useEffect(() => {
        document.title = seller.role + " - Decentralized";
        if (seller.isSold) { setIsInside(false) }

    }, [seller])

    function clickBack() {
        setIsInside(false)
    }

    function clickBuy() {
        if (window.confirm("yakin membeli?")) {
            socket.emit("ds:buy", {
                decentralizedId: seller.decentralizedId,
                phaseId: data.currentPhase.id
            })
            setMyProfit(Number(data.unitValue) - Number(seller.price))
            setStatus(true)
        }
    }

    const block = (seller.price > data.unitValue) ?
        <>
            <p className='mb-3'>Harga tersebut melebihi Unit Value anda</p>
            <div className='mt-3'>
                <Button onClick={clickBack} variant='secondary' className='fs-4 py-2 px-4'> <i className='bx bx-arrow-back'></i> Kembali</Button>
            </div>
        </>
        :
        <>
            <p className='mb-3'>Unit Value anda sebesar <span className='fw-bold'>Rp. {data.unitValue}</span></p>
            <div className='mt-3'>
                <Button onClick={clickBack} variant='secondary' className='fs-4 py-2 px-4'> <i className='bx bx-arrow-back'></i> Kembali</Button>
                <Button onClick={clickBuy} className='fs-4 py-2 px-4 ms-3'> <i className='bx bxs-cart-add' ></i> Beli</Button>
            </div>
        </>
        ;

    return (
        <Container className='text-center d-flex flex-column'>
            <Timer minutes={timer} />
            <p className='mt-5'>Harga yang ditawarkan oleh <span className='fw-bold'>{seller.role}</span> adalah</p>
            <h1 className='mb-4 mb-xl-5 text-primary fw-bolder'>Rp. {seller.price}</h1>

            {status ? <p className='mt-5'>menunggu partisipan lain...</p> : block}

            <Label
                className="mt-5 mx-auto"
                phase={data.phaseName}
                goods={data.goodsType + " (" + capitalize(data.goodsName) + ")"}
                inflation={data.inflationType}
            />
        </Container >
    )
}

// ---------------------------------------------SELLER
export function PostPriceDS({ data, timer }) {
    const [status, setStatus] = useState(false);
    const [price, setPrice] = useState(false);

    function submitHandler(e) {
        e.preventDefault()
        socket.emit("ds:inputSellerPrice", {
            price: Number(price),
            phaseId: data.currentPhase.id
        })
        setStatus(true);
    }

    return (
        <Container className='text-center d-flex flex-column'>
            <Timer minutes={timer} />
            <p className='mt-5'>Anda mendapat <span className='fw-bolder'>Unit Cost</span> sebesar</p>
            <h1 className='mb-4 mb-xl-5 text-primary fw-bolder'>{displayPrice(data.unitCost, data.currentPhase.phaseType)}
            </h1>

            <Image src={(data.goodsPic) ? imgURL + data.goodsPic : ''} fluid alt={data.goodsType} className='mx-auto' style={{ height: "360px" }} />
            {status ?
                <p className='mt-5'>menunggu partisipan lain...</p>
                :
                <Form onSubmit={submitHandler} className='mt-5'>
                    <Form.Group controlId="inputHarga">
                        <Form.Label className='mb-3'>Masukkan <span className='fw-bolder'>harga kesepakatan</span> yang ingin anda tetapkan</Form.Label>
                        {(data.currentPhase.phaseType !== "postRedenomPrice") ?
                            <Form.Control type="number"
                                className='text-center' required
                                onChange={e => setPrice(e.target.value)}
                                min={data.unitCost}
                                placeholder={data.unitCost}
                            />
                            :
                            <Form.Control type="number"
                                className='text-center' required
                                onChange={e => setPrice(e.target.value)}
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
                className="mt-5 mx-auto"
                phase={data.phaseName}
                goods={data.goodsType + " (" + capitalize(data.goodsName) + ")"}
                inflation={data.inflationType}
            />
        </Container >
    )
}

export function SellerIdleDS({ data, timer, phaseContinue }) {
    const [seller, setSeller] = useState(data.seller);
    const [countSold, setCountSold] = useState(0);
    const [myProfit, setMyProfit] = useState(0);
    let myID = JSON.parse(localStorage.getItem("auth"));
    myID = myID.id;

    useEffect(() => {
        socket.on("decentralizedList", (res) => {
            let count = 0;
            const temp = res.map((item, i) => {
                count = (item.isSold) ? (count + 1) : count;
                if (item.sellerId === myID) setMyProfit(item.price - data.unitCost)
                return {
                    sellerId: item.sellerId,
                    role: "Penjual " + (i + 1),
                    price: item.price,
                    status: (item.isSold) ? "done" : "",
                    postedOfferId: item.id
                }
            })
            setSeller(temp)
            setCountSold(count)
        })

        if (timer <= 0 || (countSold === (data.participantNumber / 2))) {
            phaseContinue(myProfit);
        }

        return () => {
            socket.off("decentralizedList")
        }
    })

    return (
        <Container className='text-center d-flex flex-column'>
            <Timer minutes={timer} />
            <Image src={(data.goodsPic) ? imgURL + data.goodsPic : ''} fluid alt={data.goodsType} className='mx-auto' style={{ height: "360px" }} />
            <p className='mt-5'>menunggu...</p>

            <section className='mt-5 d-flex justify-content-between flex-wrap'>
                {seller.map((item, i) => (
                    <Card
                        key={i}
                        variant={(item.status === "done") ? "done" : "wait"}
                        className="mb-3"
                        role={item.role}
                    >
                        {displayPrice(item.price, data.currentPhase.phaseType)}
                    </Card>
                ))}
            </section>

            <Label
                className="mt-5 mx-auto"
                phase={data.phaseName}
                goods={data.goodsType + " (" + capitalize(data.goodsName) + ")"}
                inflation={data.inflationType}
            />
        </Container >
    );
}