import { useEffect } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import Label from '../../../components/Label'

export default function DoubleAuction() {

    useEffect(() => {
        document.title = "Double Auction"
    }, [])

    function submitHandler() { }

    return (
        <Container className='text-center d-flex flex-column'>

            <section className='row my-5 py-5'>
                <div className="col-md-6">
                    <p className=''>Anda mendapat <span className='fw-bolder'>Unit Value</span> sebesar</p>
                    <h1 className='text-primary fw-bolder'>Rp. 8900</h1>
                </div>
                <div className="col-md-6">
                    <p className=''>Anda mendapat <span className='fw-bolder'>Unit Value</span> sebesar</p>
                    <h1 className='text-primary fw-bolder'>Rp. 8900</h1>
                </div>
            </section>

            <Form onSubmit={submitHandler} className='mb-5'>
                <Form.Group controlId="inputHarga">
                    <Form.Label className='mb-3'>Masukkan <span className='fw-bolder'>harga kesepakatan</span> yang ingin anda tetapkan</Form.Label>
                    <Form.Control type="number" required />
                </Form.Group>
                <Button type="submit" className='mt-3 py-3 px-5 fs-4'>Tetapkan</Button>
            </Form>

            <Label
                className="my-5 mx-auto"
                phase="Pre-Redenominasi"
                goods="Elastis (Mobil)"
                inflation="Tinggi"
            />
        </Container>
    )
}
