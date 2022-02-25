import { useEffect } from 'react';
import { useState } from 'react'
import { Container, Button } from 'react-bootstrap'
import socket from "../../adapters/SocketIO";
import { capitalize } from '../../Utils';
import { participantStage } from './Participants';
import "./Ready.css";

export default function ReadyScreenHandler({ data, setStateStage }) {
    const [ready, setReady] = useState(false)

    useEffect(() => {
        socket.on("readyCount", res => {
            if (res.numberOfReadyPlayer === res.totalPlayer) { setStateStage(participantStage.SIMULATION); }
        });

        return () => {
            socket.off("readyCount");
        }
    }, [setStateStage])

    function btnHandler(e) {
        e.preventDefault()
        socket.emit("toggleReady");
        socket.on("serverMessage", res => {
            if (res.status === 200) {
                setReady(res.data.user.isReady);
                const changeStatus = !ready;
                setReady(changeStatus);
            }
            socket.off("serverMessage");
        })
    }

    return (
        <Container className='text-center'>
            <section className='mt-5 pt-5'>
                <p>Anda berperan sebagai</p>
                <h1 className='text-primary fw-bolder'>{capitalize(data.type)}</h1>
            </section>

            <section className='mt-3'>
                <p>dalam simulasi “Kajian pengaruh Redenominasi dalam
                    Sistem transaksi <span className='fw-bold'>{capitalize(data.simulationType)}</span>”
                </p>
                <div>
                    <p>Jenis Barang: <span className='fw-bold'>{data.goodsType} {(data.goodsName) ? ('(' + capitalize(data.goodsName)) + ')' : ''}</span></p>
                    <p>Jenis Inflasi: <span className='fw-bold'>{data.inflationType}</span></p>
                </div>
            </section>

            <section className='mt-5 py-3'>
                <p>Klik tombol dibawah jika anda sudah dalam keadaan siap mengikuti simulasi</p>
                {ready ?
                    <>
                        <Button variant='danger' className='btn-ready fs-3 px-5 py-3' onClick={btnHandler}>Batal Siap</Button>
                        <p>menunggu partisipan lain...</p>
                    </>
                    :
                    <Button className='btn-ready fs-3 px-5 py-3' onClick={btnHandler}>Saya Siap</Button>
                }
            </section>
        </Container>
    )
}
