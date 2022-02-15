import { useEffect, useState } from 'react'
import { Container, Image } from 'react-bootstrap'
import socket from "../../../adapters/SocketIO";
import { imgURL } from '../../../adapters/serverURL'
import Card from '../../../components/Card'
import Label from '../../../components/Label'
import Timer from '../../../components/Timer'
import { capitalize, displayPrice } from '../../../Utils'

export function BuyerIdleScreen({ data, timer }) {
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

export function FlashSaleScreen({ data, timer, phaseContinue }) {
    const [seller, setSeller] = useState(data.seller);
    const [hasBought, setHasBought] = useState(false);
    const [countSold, setCountSold] = useState(0);
    const [myProfit, setMyProfit] = useState(0);

    useEffect(() => {
        socket.on("postedOfferList", (res) => {
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
            setSeller(temp)
            setCountSold(count)
        })

        return () => { socket.off("postedOfferList") }
    }, [])

    useEffect(() => {
        if (timer <= 0 || (countSold === parseInt(data.participantNumber / 2))) {
            phaseContinue(myProfit);
        }
    })

    function buyHandler(e, item) {
        e.preventDefault();
        if (item.price <= data.unitValue) {
            if (window.confirm("yakin membeli?")) {
                socket.emit("po:buy", {
                    postedOfferId: item.postedOfferId,
                    phaseId: data.currentPhase.id
                })
                socket.on("serverMessage", (res) => {
                    if (
                        res.status === 200 &&
                        res.message === "Successfully buy transaction"
                    ) {
                        setMyProfit(data.unitValue - item.price);
                        setHasBought(true)
                    }
                })
            }
        } else {
            alert("harga melebihi unit value anda!")
        }
    }

    return (
        <Container className='text-center d-flex flex-column'>
            <Timer minutes={timer} />
            <p className='mt-5'>Anda mendapat <span className='fw-bolder'>Unit Value</span> sebesar</p>
            <h1 className='mb-4 mb-xl-5 text-primary fw-bolder'>{displayPrice(data.unitValue, data.currentPhase.phaseType)}</h1>

            <Image src={(data.goodsPic) ? imgURL + data.goodsPic : ''} fluid alt={data.goodsType} className='mx-auto' style={{ height: "360px" }} />

            <section className='mt-5 d-flex justify-content-between flex-wrap'>
                {seller.map((item, i) => (
                    <Card
                        key={i}
                        variant={(item.status === "done") ? "done" : ((hasBought) ? 'wait' : '')}
                        className="mb-3"
                        role={item.role}
                        onBtnClick={(e) => { buyHandler(e, item) }}
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