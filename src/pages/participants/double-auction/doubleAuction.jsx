import { Button, Container, Form } from 'react-bootstrap'
import Label from '../../../components/Label'
import { capitalize } from '../../../Utils'

export function SellerAuctionScreen({ data }) {
    function submitHandler(e) {
        e.preventDefault()
    }

    return (
        <Container className='text-center d-flex flex-column'>
            <section className='row my-5 py-5 border rounded-pill'>
                <div className="col-md-4">
                    <p>Offer</p>
                    <h1 className='text-primary fw-bolder'>Rp. {data.minPrice}</h1>
                </div>
                <div className="col-md-4">
                    <p><span className='fw-bolder'>Unit Cost</span> anda</p>
                    <h1 className='text-primary fw-bolder'>Rp. {data.unitCost}</h1>
                </div>
                <div className="col-md-4">
                    <p>Bid</p>
                    <h1 className='text-primary fw-bolder'>Rp. {data.maxPrice}</h1>
                </div>
            </section>

            <Form onSubmit={submitHandler} className='mb-5'>
                <Form.Group controlId="inputHarga">
                    <Form.Label className='mb-3'>Masukkan <span className='fw-bolder'>harga kesepakatan</span> yang ingin anda tetapkan</Form.Label>
                    <Form.Control type="number"
                        className='text-center'
                        required
                        max={data.unitValue}
                    />
                </Form.Group>
                <Button type="submit" className='mt-3 py-3 px-5 fs-4'>Tetapkan</Button>
            </Form>

            <Label
                className="my-5 mx-auto"
                phase={data.phase}
                goods={data.goodsType + " (" + capitalize(data.goodsName) + ")"}
                inflation={data.inflationType}
            />
        </Container>
    )
}

export function BuyerAuctionScreen({ data }) {
    function submitHandler(e) {
        e.preventDefault()
    }

    return (
        <Container className='text-center d-flex flex-column'>

            <section className='row my-5 py-5 border rounded-pill'>
                <div className="col-md-4">
                    <p>Offer</p>
                    <h1 className='text-primary fw-bolder'>Rp. {data.minPrice}</h1>
                </div>
                <div className="col-md-4">
                    <p><span className='fw-bolder'>Unit Value</span> anda</p>
                    <h1 className='text-primary fw-bolder'>Rp. {data.unitValue}</h1>
                </div>
                <div className="col-md-4">
                    <p>Bid</p>
                    <h1 className='text-primary fw-bolder'>Rp. {data.maxPrice}</h1>
                </div>
            </section>

            <Form onSubmit={submitHandler} className='mb-5'>
                <Form.Group controlId="inputHarga">
                    <Form.Label className='mb-3'>Masukkan <span className='fw-bolder'>harga kesepakatan</span> yang ingin anda tetapkan</Form.Label>
                    <Form.Control type="number"
                        className='text-center'
                        required
                        min={data.unitCost}
                    />
                </Form.Group>
                <Button type="submit" className='mt-3 py-3 px-5 fs-4'>Tetapkan</Button>
            </Form>

            <Label
                className="my-5 mx-auto"
                phase={data.phase}
                goods={data.goodsType + " (" + capitalize(data.goodsName) + ")"}
                inflation={data.inflationType}
            />
        </Container>
    )
}

