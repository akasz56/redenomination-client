import { useEffect } from 'react'
import { Container } from 'react-bootstrap'
import Card from '../../../components/Card'
import Label from '../../../components/Label'

export default function PostedOffer() {
    useEffect(() => {
        document.title = "Posted Offer"
    }, [])

    return (
        <Container className='text-center d-flex flex-column'>

            <p className='mt-5 order-0'>Anda mendapat <span className='fw-bolder'>Unit Value</span> sebesar</p>
            <h1 className='mb-4 mb-xl-5 order-1 text-primary fw-bolder'>Rp. 8900</h1>

            <section className='order-3 order-xl-2 d-flex justify-content-between flex-wrap'>
                {[...Array(10)].map((item, i) => (
                    <Card
                        key={i}
                        className="mb-3"
                        role="Penjual 1"
                    >
                        Rp. 3700
                    </Card>
                ))}
            </section>

            <Label
                className="mb-5 mb-xl-0 mt-xl-3 order-2 order-xl-3 mx-auto"
                phase="Pre-Redenominasi"
                goods="Elastis (Mobil)"
                inflation="Tinggi"
            />
        </Container >
    )
}
