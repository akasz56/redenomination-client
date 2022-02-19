import { useEffect, useState } from 'react'
import { Button, Container, Image } from 'react-bootstrap'
import socket from "../../../adapters/SocketIO";
import { imgURL } from '../../../adapters/serverURL'
import Card from '../../../components/Card'
import Label from '../../../components/Label'
import Timer from '../../../components/Timer';
import { capitalize, displayPrice } from '../../../Utils';

export function BuyerIdleDS({ data, timer }) {
    return (
        <Container className='text-center d-flex flex-column'>
            <Timer minutes={timer} />
            <p className='mt-5'>Anda mendapat <span className='fw-bolder'>Unit Value</span> sebesar</p>
            <h1 className='mb-4 mb-xl-5 text-primary fw-bolder'>{displayPrice(data.detail.unitValue, data.currentPhase.phaseType)}</h1>

            <Image src={(data.goodsPic) ? imgURL + data.goodsPic : ''} fluid alt={data.goodsType} className='mx-auto' style={{ height: "360px" }} />
            <p className='mt-5'>menunggu penjual memasang harga......</p>

            <Label
                className="mt-5 mx-auto"
                phase={data.currentPhase.phaseName}
                goods={data.goodsType + " (" + capitalize(data.goodsName) + ")"}
                inflation={data.inflationType}
            />
        </Container >
    )
}

export function ShopHandler({ data, timer }) {
    const [isInside, setIsInside] = useState(null);
    const [hasBought, setHasBought] = useState(false);

    useEffect(() => {
        document.title = "Decentralized";
    }, [isInside])

    function clickHandler(item) {
        setIsInside(item.decentralizedId)
    }

    if (isInside) {
        const shop = sellers.find((item) => item.decentralizedId === isInside);
        return <ShopView data={{ ...data, shop: shop, hasBought: hasBought }} timer={timer} setIsInside={setIsInside} setHasBought={setHasBought} />
    } else {
        return (
            <Container className='text-center d-flex flex-column'>
                <Timer minutes={timer} />
                <h3 className='mt-5'>Silahkan <span className='fw-bold'>Pilih Penjual</span> untuk melihat Harga</h3>
                <section className='mt-5 d-flex justify-content-between flex-wrap'>
                    {data.seller.map((item, i) => (
                        <Card
                            key={i}
                            variant={(item.status) ? "done" : (hasBought ? "wait" : "decentralized")}
                            className="mb-3"
                            role={item.role}
                            onBtnClick={(e) => { clickHandler(item) }}
                        />
                    ))}
                </section>

                <Label
                    className="mt-5 mx-auto"
                    phase={data.currentPhase.phaseName}
                    goods={data.goodsType + " (" + data.goodsName + ")"}
                    inflation={data.inflationType}
                />
            </Container >
        )
    }
}

function ShopView({ data, timer, setIsInside, setHasBought }) {
    useEffect(() => {
        document.title = data.shop.role + " - Decentralized";
    }, [])

    useEffect(() => {
        if (data.shop.isSold) { setIsInside(null) }
    })

    function clickBack() {
        setIsInside(null)
    }

    function clickBuy() {
        if (window.confirm("yakin membeli?")) {
            socket.emit("ds:buy", {
                decentralizedId: data.shop.decentralizedId,
                phaseId: data.currentPhase.id
            })
            setHasBought(true)
        }
    }

    const block = (data.shop.price > data.detail.unitValue) ?
        <>
            <p className='mb-3'>Harga tersebut melebihi Unit Value anda</p>
            <div className='mt-3'>
                <Button onClick={clickBack} variant='secondary' className='fs-4 py-2 px-4'> <i className='bx bx-arrow-back'></i> Kembali</Button>
            </div>
        </>
        :
        <>
            <p className='mb-3'>Unit Value anda sebesar <span className='fw-bold'>Rp. {data.detail.unitValue}</span></p>
            <div className='mt-3'>
                <Button onClick={clickBack} variant='secondary' className='fs-4 py-2 px-4'> <i className='bx bx-arrow-back'></i> Kembali</Button>
                <Button onClick={clickBuy} className='fs-4 py-2 px-4 ms-3'> <i className='bx bxs-cart-add' ></i> Beli</Button>
            </div>
        </>
        ;

    return (
        <Container className='text-center d-flex flex-column'>
            <Timer minutes={timer} />
            <p className='mt-5'>Harga yang ditawarkan oleh <span className='fw-bold'>{data.shop.role}</span> adalah</p>
            <h1 className='mb-4 mb-xl-5 text-primary fw-bolder'>{displayPrice(data.shop.price, data.currentPhase.phaseType)}</h1>

            {data.hasBought ? <p className='mt-5'>menunggu partisipan lain...</p> : block}

            <Label
                className="mt-5 mx-auto"
                phase={data.currentPhase.phaseName}
                goods={data.goodsType + " (" + capitalize(data.goodsName) + ")"}
                inflation={data.inflationType}
            />
        </Container >
    )
}