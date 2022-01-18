import { useEffect } from 'react'
import { Container } from 'react-bootstrap'
import Card from '../../../components/Card'

export default function Decentralized() {

    useEffect(() => {
        document.title = "Posted Offer"
    }, [])

    return (
        <Container>
            <div className='mt-5 d-flex justify-content-between flex-wrap'>
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
            </div>
        </Container >
    )
}
