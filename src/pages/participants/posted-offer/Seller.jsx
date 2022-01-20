import { useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import Card from '../../../components/Card'
import Label from '../../../components/Label'
import { capitalize } from '../../../Utils'

//------------------------------ Data section
function generateSeller(num = 1) {
    let sellers = [];
    for (let i = 1; i <= num; i++) {
        sellers.push({
            role: "Penjual " + i,
            price: Math.floor(Math.random() * 100) * 100,
            status: "wait"
        })
    }
    return sellers;
}

const API = {
    role: "Seller",
    goodsType: "Elastis",
    goodsName: "Laptop",
    inflationType: "Inflasi Tinggi",
}
const socket = {
    phase: "Sebelum Redenominasi",
    unitCost: 3700,
    seller: generateSeller(10),
}

//------------------------------ Screens
export function PostPriceScreen({ data }) {
    const [status, setStatus] = useState(false);
    const [price, setPrice] = useState(false);

    function submitHandler() {
        console.log(price);
        setStatus(true);
    }

    return (
        <Container className='text-center d-flex flex-column'>
            <p className='mt-5'>Anda mendapat <span className='fw-bolder'>Unit Cost</span> sebesar</p>
            <h1 className='mb-4 mb-xl-5 text-primary fw-bolder'>Rp. {socket.unitCost}</h1>

            {status ?
                <p className='mt-5'>menunggu partisipan lain...</p>
                :
                <Form onSubmit={submitHandler} className='mt-5'>
                    <Form.Group controlId="inputHarga">
                        <Form.Label className='mb-3'>Masukkan <span className='fw-bolder'>harga kesepakatan</span> yang ingin anda tetapkan</Form.Label>
                        <Form.Control type="number" required onChange={e => setPrice(e.target.value)} />
                    </Form.Group>
                    <Button type="submit" className='mt-3 py-3 px-5 fs-4'>Tetapkan</Button>
                </Form>
            }

            <Label
                className="mt-5 mx-auto"
                phase={socket.phase}
                goods={API.goodsType + " (" + capitalize(API.goodsName) + ")"}
                inflation={API.inflationType}
            />
        </Container >
    )
}

export function SellerIdleScreen() {
    return (
        <Container className='text-center d-flex flex-column'>
            <p className='mt-5'>menunggu...</p>

            <section className='mt-5 d-flex justify-content-between flex-wrap'>
                {socket.seller.map((item, i) => (
                    <Card
                        key={i}
                        variant={item.status}
                        className="mb-3"
                        role={item.role}
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