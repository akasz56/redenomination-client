import { useEffect } from 'react'
import { Container } from 'react-bootstrap'
import Card from '../../components/Card'
import Label from '../../components/Label'

export default function Decentralized() {

    useEffect(() => {
        document.title = "Decentralized"
    }, [])

    return (
        <Container className='text-center d-flex flex-column'>

            <section className='mt-5 d-flex justify-content-between flex-wrap'>
                {[...Array(10)].map((item, i) => (
                    <Card
                        key={i}
                        variant="decentralized"
                        className="mb-3"
                        role="Penjual 1"
                    >
                        Rp. 3700
                    </Card>
                ))}
            </section>

            <Label
                className="mt-5 mx-auto"
                phase="Pre-Redenominasi"
                goods="Elastis (Mobil)"
                inflation="Tinggi"
            />
        </Container >
    )
}
