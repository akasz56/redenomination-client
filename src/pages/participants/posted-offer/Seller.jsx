import { useEffect, useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import Card from '../../../components/Card'
import Label from '../../../components/Label'
import { capitalize } from '../../../Utils'

export function PostPriceScreen({ socket, data, setStage }) {
    const [status, setStatus] = useState(false);
    const [price, setPrice] = useState(false);

    useEffect(() => {
        console.log(typeof data.unitCost)
    })

    function submitHandler(e) {
        e.preventDefault()
        socket.emit("po:inputSellerPrice", {
            price: Number(price),
            phaseId: data.currentPhase.id
        })
        setStatus(true);
    }

    return (
        <Container className='text-center d-flex flex-column'>
            <p className='mt-5'>Anda mendapat <span className='fw-bolder'>Unit Cost</span> sebesar</p>
            <h1 className='mb-4 mb-xl-5 text-primary fw-bolder'>Rp. {data.unitCost}</h1>

            {status ?
                <p className='mt-5'>menunggu partisipan lain...</p>
                :
                <Form onSubmit={submitHandler} className='mt-5'>
                    <Form.Group controlId="inputHarga">
                        <Form.Label className='mb-3'>Masukkan <span className='fw-bolder'>harga kesepakatan</span> yang ingin anda tetapkan</Form.Label>
                        <Form.Control type="number" min={data.unitCost} step="0.001" required onChange={e => setPrice(e.target.value)} placeholder={data.unitCost} />
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

export function SellerIdleScreen({ socket, data, setStage, checkPhase }) {
    const [seller, setSeller] = useState(data.seller);
    const [countSold, setCountSold] = useState(0);

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

        if (countSold === (data.participantNumber / 2)) {
            checkPhase();
        }
        // if (timer || all seller sold) {
        //     checkPhase()
        // }

        return () => {
            socket.off("postedOfferList")
        }
    })

    return (
        <Container className='text-center d-flex flex-column'>
            <p className='mt-5'>menunggu...</p>

            <section className='mt-5 d-flex justify-content-between flex-wrap'>
                {seller.map((item, i) => (
                    <Card
                        key={i}
                        variant={(item.status === "done") ? "done" : "wait"}
                        className="mb-3"
                        role={item.role}
                    >
                        Rp. {item.price}
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