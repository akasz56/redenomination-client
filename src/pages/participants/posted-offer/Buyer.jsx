import { useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import Card from '../../../components/Card'
import Label from '../../../components/Label'
import { capitalize } from '../../../Utils'

//------------------------------ Data section
function generateSeller(num = 1) {
    let sellers = new Array();
    for (let i = 1; i <= num; i++) {
        sellers.push({
            role: "Penjual " + i,
            price: Math.floor(Math.random() * 100) * 100,
            status: ''
        })
    }
    return sellers;
}

const API = {
    role: "Buyer",
    goodsType: "Elastis",
    goodsName: "Laptop",
    inflationType: "Inflasi Tinggi",
}
const socket = {
    phase: "Sebelum Redenominasi",
    unitCost: 8700,
    seller: generateSeller(10),
}

//------------------------------ Screens
export function BuyerIdleScreen() {
    return (
        <Container className='text-center d-flex flex-column'>
            <p className='mt-5'>Anda mendapat <span className='fw-bolder'>Unit Value</span> sebesar</p>
            <h1 className='mb-4 mb-xl-5 text-primary fw-bolder'>Rp. {socket.unitCost}</h1>

            <p className='mt-5'>menunggu penjual memasang harga......</p>

            <Label
                className="mt-5 mx-auto"
                phase={socket.phase}
                goods={API.goodsType + " (" + capitalize(API.goodsName) + ")"}
                inflation={API.inflationType}
            />
        </Container >
    )
}

export function FlashSaleScreen() {
    return (
        <Container className='text-center d-flex flex-column'>
            <p className='mt-5'>Anda mendapat <span className='fw-bolder'>Unit Value</span> sebesar</p>
            <h1 className='mb-4 mb-xl-5 text-primary fw-bolder'>Rp. {socket.unitCost}</h1>

            <section className='mt-5 d-flex justify-content-between flex-wrap'>
                {socket.seller.map((item, i) => (
                    <Card
                        key={i}
                        variant={item.status}
                        className="mb-3"
                        role={item.role}
                        onBtnClick={(e) => { console.log(item) }}
                    >
                        Rp. {item.price}
                    </Card>
                ))}
            </section>

            <Label
                className="mt-5 mx-auto"
                phase={socket.phase}
                goods={API.goodsType + " (" + capitalize(API.goodsName) + ")"}
                inflation={API.inflationType}
            />
        </Container >
    );
}

export function BuyerCompleteScreen() {
    return (
        <Container>
            <h1 className='child'>Simulasi Selesai</h1>
        </Container>
    )
}
