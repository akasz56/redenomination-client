import { Button, Container, Form } from 'react-bootstrap'
import Label from '../../../components/Label'
import { capitalize } from '../../../Utils'

//------------------------------ Data section
const API = {
    goodsType: "Elastis",
    goodsName: "Laptop",
    inflationType: "Inflasi Tinggi",
}
const socket = {
    phase: "Sebelum Redenominasi",
    unitValue: 7000,
    minPrice: 3700,
    maxPrice: 8900,
}

export default function Buyer() {
    function submitHandler(e) {
        e.preventDefault()
    }

    return (
        <Container className='text-center d-flex flex-column'>
            <section className='row my-5 py-5 border rounded-pill'>
                <div className="col-md-4">
                    <p>Harga Terendah</p>
                    <h1 className='text-primary fw-bolder'>Rp. {socket.minPrice}</h1>
                </div>
                <div className="col-md-4">
                    <p><span className='fw-bolder'>Unit Value</span> anda</p>
                    <h1 className='text-primary fw-bolder'>Rp. {socket.unitValue}</h1>
                </div>
                <div className="col-md-4">
                    <p>Harga Tertinggi</p>
                    <h1 className='text-primary fw-bolder'>Rp. {socket.maxPrice}</h1>
                </div>
            </section>

            <Form onSubmit={submitHandler} className='mb-5'>
                <Form.Group controlId="inputHarga">
                    <Form.Label className='mb-3'>Masukkan <span className='fw-bolder'>harga kesepakatan</span> yang ingin anda tetapkan</Form.Label>
                    <Form.Control type="number"
                        className='text-center'
                        required
                        max={socket.unitValue}
                    />
                </Form.Group>
                <Button type="submit" className='mt-3 py-3 px-5 fs-4'>Tetapkan</Button>
            </Form>

            <Label
                className="my-5 mx-auto"
                phase={socket.phase}
                goods={API.goodsType + " (" + capitalize(API.goodsName) + ")"}
                inflation={API.inflationType}
            />
        </Container>
    )
}
