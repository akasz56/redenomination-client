import { useEffect, useState, useReducer } from 'react';
import { Button, Container, Form, Image, Modal } from 'react-bootstrap'
import socket from "../../../adapters/SocketIO";
import { imgURL } from '../../../adapters/serverURL';
import Label from '../../../components/Label'
import Timer from '../../../components/Timer';
import { capitalize, displayPrice, printLog } from '../../../Utils'
import LoadingComponent from '../../../components/Loading';

export function SellerAuctionScreen({ data }) {
    function submitHandler(e) {
        e.preventDefault();
        socket.emit("da:postSeller", {
            sellerBargain: parseInt(inputPrice),
            phaseId: data.currentPhase.id
        });
        dispatch({ type: RED_ACT.HAS_INPUTTED_ONCE })
    }

    if (currentState.waitBreak) return (<>
        <LoadingComponent className='child' />

        <Modal show={showModal} aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header>
                <Modal.Title>Notifikasi</Modal.Title>
            </Modal.Header>
            <Modal.Body>Terdapat match harga dengan Penjual</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => { setShowModal(false) }}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    </>)
    else {
        return (
            <Container className='text-center d-flex flex-column'>
                <Timer minutes={timer} />
                <section className='row my-5 py-5 border rounded-pill'>
                    <div className="col-md-4">
                        <p>Bid</p>
                        <h1 className='text-primary fw-bolder'>{currentState.socketData.minPrice}</h1>
                    </div>
                    <div className="col-md-4">
                        <p><span className='fw-bolder'>Unit Cost</span> anda</p>
                        <h1 className='text-primary fw-bolder'>{displayPrice(data.detail.unitCost, data.currentPhase.phaseType)}</h1>
                    </div>
                    <div className="col-md-4">
                        <p>Offer</p>
                        <h1 className='text-primary fw-bolder'>{currentState.socketData.maxPrice}</h1>
                    </div>
                </section>

                <Image src={(data.goodsPic) ? imgURL + data.goodsPic : ''} fluid alt={data.goodsType} className='mx-auto' style={{ height: "360px" }} />
                {currentState.matched ?
                    <p>menunggu partisipan lain...</p>
                    :
                    <Form onSubmit={submitHandler} className='mb-5'>
                        <Form.Group controlId="inputHarga">
                            <Form.Label className='mb-3'>Masukkan <span className='fw-bolder'>harga kesepakatan</span> yang ingin anda ajukan</Form.Label>
                            {(data.currentPhase.phaseType !== "postRedenomPrice") ?
                                <Form.Control type="number" className='text-center' defaultValue={inputPrice} required
                                    onChange={e => { setInputPrice(e.target.value) }}
                                    min={data.detail.unitCost}
                                    placeholder={data.detail.unitCost}
                                />
                                :
                                <Form.Control type="number" className='text-center' defaultValue={inputPrice} required
                                    onChange={e => { setInputPrice(e.target.value) }}
                                    min={data.detail.unitCost / 1000}
                                    placeholder={data.detail.unitCost / 1000}
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

                <Modal show={showModal} aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Notifikasi</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Terdapat match harga dengan Pembeli</Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => { setShowModal(false) }}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

            </Container>
        )
    }
}