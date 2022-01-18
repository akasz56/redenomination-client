import { useState } from 'react'
import { Container, Button } from 'react-bootstrap'
import "./Ready.css";

export default function Ready() {
    const [ready, setReady] = useState(false)

    function btnHandler(e) {
        e.preventDefault()
        setReady((prev) => !prev);
    }
    return (
        <Container className='text-center'>
            <p className='mt-5'>Anda berperan sebagai</p>
            <h1 className='text-primary'>Penjual</h1>
            <p>dalam simulasi “Kajian pengaruh Redenominasi dalam Sistem transaksi <span className='fw-bold'>Posted Offer</span>”</p>
            <div>
                <p>Jenis Barang: <span className='fw-bold'>Elastis (Mobil)</span></p>
                <p>Jenis Inflasi: <span className='fw-bold'>Inflasi Tinggi</span></p>
            </div>
            <p className='mt-5'>Klik tombol dibawah jika anda sudah dalam keadaan siap mengikuti simulasi</p>
            {ready ?
                <>
                    <Button variant='danger' className='btn-ready fs-2' onClick={btnHandler}>Batal Siap</Button>
                    <p>menunggu partisipan lain...</p>
                </>
                :
                <Button className='btn-ready fs-2' onClick={btnHandler}>Saya Siap</Button>
            }
        </Container>
    )
}
