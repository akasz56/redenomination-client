import { useEffect, useState } from 'react'
import { Button, Container, Form, Image } from 'react-bootstrap'
import socket from "../../../adapters/SocketIO";
import { imgURL } from '../../../adapters/serverURL'
import Card from '../../../components/Card'
import Label from '../../../components/Label'
import Timer from '../../../components/Timer'
import { capitalize, displayPrice, numberInputFormat } from '../../../Utils'

export function PostPriceScreen({ data, timer }) {
    const [status, setStatus] = useState(false);
    const [price, setPrice] = useState(false);

    useEffect(() => {
        if (timer <= 0) {
            if (!status) {
                socket.emit("po:inputSellerPrice", {
                    price: Number(data.detail.unitCost),
                    phaseId: data.currentPhase.id
                })
            }
        }
    }, [timer])

    function submitHandler(e) {
        e.preventDefault()

        if (data.currentPhase.phaseType !== "postRedenomPrice") {
            if (price >= data.detail.unitCost) {
                socket.emit("po:inputSellerPrice", {
                    price: Number(price),
                    phaseId: data.currentPhase.id
                })
                setStatus(true);
            } else {
                alert("harga kurang dari unit cost anda!")
            }
        } else {
            if (price >= data.detail.unitCost / 1000) {
                socket.emit("po:inputSellerPrice", {
                    price: Number(price),
                    phaseId: data.currentPhase.id
                })
                setStatus(true);
            } else {
                alert("harga kurang dari unit cost anda!")
            }
        }
    }

    return (
        <Container className='text-center d-flex flex-column'>
            <Timer minutes={timer} />
            <p className='mt-5'>Anda mendapat <span className='fw-bolder'>Unit Cost</span> sebesar</p>
            <h1 className='mb-4 mb-xl-5 text-primary fw-bolder'>{displayPrice(data.detail.unitCost, data.currentPhase.phaseType)}
            </h1>

            <Image src={(data.goodsPic) ? imgURL + data.goodsPic : ''} fluid alt={data.goodsType} className='mx-auto' style={{ height: "360px" }} />
            {status ?
                <p className='mt-5'>menunggu partisipan lain...</p>
                :
                <Form onSubmit={submitHandler} className='mt-5'>
                    <Form.Group controlId="inputHarga">
                        <Form.Label className='mb-3'>Masukkan <span className='fw-bolder'>harga kesepakatan</span> yang ingin anda tetapkan</Form.Label>
                        <Form.Control className='text-center' required
                            onChange={e => {
                                const value = numberInputFormat(e, e.target.value)
                                setPrice(value)
                            }}
                            placeholder={(data.currentPhase.phaseType !== "postRedenomPrice") ?
                                data.detail.unitCost
                                :
                                data.detail.unitCost / 1000
                            }
                        />
                    </Form.Group>
                    <Button type="submit" className='mt-3 py-3 px-5 fs-4'>Tetapkan</Button>
                </Form>
            }

            <Label
                className="mt-5 mx-auto"
                phase={data.currentPhase.phaseName}
                goods={data.goodsType + " (" + capitalize(data.goodsName) + ")"}
                inflation={data.inflationType}
            />
        </Container >
    )
}

export function SellerIdleScreen({ data, timer }) {
    return (
        <Container className='text-center d-flex flex-column'>
            <Timer minutes={timer} />
            <Image src={(data.goodsPic) ? imgURL + data.goodsPic : ''} fluid alt={data.goodsType} className='mx-auto' style={{ height: "360px" }} />
            <p className='mt-5'>menunggu...</p>

            <section className='mt-5 d-flex justify-content-between flex-wrap'>
                {data.seller.map((item, i) => (
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
                phase={data.currentPhase.phaseName}
                goods={data.goodsType + " (" + capitalize(data.goodsName) + ")"}
                inflation={data.inflationType}
            />
        </Container >
    );
}