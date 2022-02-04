import { useEffect, useState } from 'react'
import { Button, Container } from 'react-bootstrap'
import socket from "../../../adapters/SocketIO";
import Card from '../../../components/Card'
import Label from '../../../components/Label'
import { capitalize } from '../../../Utils';
import { BuyerIdleScreen } from '../posted-offer/Buyer';
import { PostPriceScreen, SellerIdleScreen } from '../posted-offer/Seller';

// ---------------------------------------------BUYER
export function BuyerIdleDS({ data, setStage }) {
    return <BuyerIdleScreen data={data} />
}

export function Lobby({ data, setStage, phaseContinue }) {
    const [isInside, setIsInside] = useState(false);

    if (isInside) { return <EnterShop data={data} zxc={{ isInside, setStage, setIsInside }} /> }
    else { return <ListShops data={data} zxc={{ isInside, setStage, setIsInside }} /> }
}

export function ListShops({ data, zxc }) {

    useEffect(() => {
        document.title = "Decentralized"
    })

    function clickHandler(item) {
        console.log(item.role);
        zxc.setIsInside(true)
    }

    return (
        <Container className='text-center d-flex flex-column'>
            <h3 className='mt-5'>Silahkan <span className='fw-bold'>Pilih Penjual</span> untuk melihat Harga</h3>
            <section className='mt-5 d-flex justify-content-between flex-wrap'>
                {data.seller.map((item, i) => (
                    <Card
                        key={i}
                        variant={item.status}
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

export function EnterShop({ data, zxc }) {
    const [status, setStatus] = useState(false);


    function clickBack() {
        console.log("clickBack");
        zxc.setIsInside(false)
    }

    function clickBuy() {
        if (window.confirm("yakin membeli?")) {
            setStatus(true)
        }
    }

    const block = (5400 > data.unitValue) ?
        <>
            <p className='mb-3'>Unit Value anda sebesar <span className='fw-bold'>Rp. {data.unitValue}</span></p>
            <div className='mt-3'>
                <Button onClick={clickBack} variant='secondary' className='fs-4 py-2 px-4'> <i className='bx bx-arrow-back'></i> Kembali</Button>
                <Button onClick={clickBuy} className='fs-4 py-2 px-4 ms-3'> <i className='bx bxs-cart-add' ></i> Beli</Button>
            </div>
        </>
        :
        <>
            <p className='mb-3'>Unit Value anda <span className='fw-bold'>(Rp. {data.unitValue})</span> melebihi harga</p>
            <div className='mt-3'>
                <Button onClick={clickBack} variant='secondary' className='fs-4 py-2 px-4'> <i className='bx bx-arrow-back'></i> Kembali</Button>
            </div>
        </>
        ;

    return (
        <Container className='text-center d-flex flex-column'>
            <p className='mt-5'>Harga yang ditawarkan oleh <span className='fw-bold'>Penjual 1</span> adalah</p>
            <h1 className='mb-4 mb-xl-5 text-primary fw-bolder'>Rp. 5400</h1>

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
export function PostPriceDS({ data, setStage, phaseContinue }) {
    return <PostPriceScreen data={data} />
}

export function SellerIdleDS({ data, setStage }) {
    return <SellerIdleScreen data={data} />
}