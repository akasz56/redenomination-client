import { Button, Container, Form, Image } from 'react-bootstrap'
import socket from "../../../adapters/SocketIO";
import { imgURL } from '../../../adapters/serverURL';
import Label from '../../../components/Label'
import Timer from '../../../components/Timer';
import { capitalize, displayPrice } from '../../../Utils'
import LoadingComponent from '../../../components/Loading';
import { useState } from 'react';

export default function BuyerAuctionScreen({ data, timer }) {
    const [inputPrice, setInputPrice] = useState(0);

    function submitHandler(e) {
        e.preventDefault();
        socket.emit("da:postBuyer", {
            buyerBargain: parseInt(inputPrice),
            phaseId: data.currentPhase.id
        });
        // HAS_INPUTTED_ONCE
    }

    if (data.isBreak) return <LoadingComponent className='child' />
    else {
        return (
            <Container className='text-center d-flex flex-column'>
                <Timer minutes={timer} />
                <section className='row my-5 py-5 border rounded-pill'>
                    <div className="col-md-4">
                        <p>Bid</p>
                        <h1 className='text-primary fw-bolder'>{data.socketData.minPrice}</h1>
                    </div>
                    <div className="col-md-4">
                        <p><span className='fw-bolder'>Unit Value</span> anda</p>
                        <h1 className='text-primary fw-bolder'>{displayPrice(data.detail.unitValue, data.currentPhase.phaseType)}</h1>
                    </div>
                    <div className="col-md-4">
                        <p>Offer</p>
                        <h1 className='text-primary fw-bolder'>{data.socketData.maxPrice}</h1>
                    </div>
                </section>

                <Image src={(data.goodsPic) ? imgURL + data.goodsPic : ''} fluid alt={data.goodsType} className='mx-auto' style={{ height: "360px" }} />
                {data.matched ?
                    <p>menunggu partisipan lain...</p>
                    :
                    <Form onSubmit={submitHandler} className='mb-5'>
                        <Form.Group controlId="inputHarga">
                            <Form.Label className='mb-3'>Masukkan <span className='fw-bolder'>harga kesepakatan</span> yang ingin anda ajukan</Form.Label>
                            {(data.currentPhase.phaseType !== "postRedenomPrice") ?
                                <Form.Control type="number" className='text-center' defaultValue={inputPrice} required
                                    onChange={e => { setInputPrice(e.target.value) }}
                                    max={data.detail.unitValue}
                                    min={0}
                                />
                                :
                                <Form.Control type="number" className='text-center' defaultValue={inputPrice} required
                                    onChange={e => { setInputPrice(e.target.value) }}
                                    max={data.detail.unitValue / 1000}
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
                    phase={data.currentPhase.phaseName}
                    goods={data.goodsType + " (" + capitalize(data.goodsName) + ")"}
                    inflation={data.inflationType}
                />
            </Container>
        )
    }
}