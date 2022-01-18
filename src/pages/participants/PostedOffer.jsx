import { useEffect } from 'react'
import { Container } from 'react-bootstrap'
import Card from '../../components/Card'

export default function PostedOffer() {

    useEffect(() => {
        document.title = "Posted Offer"
    }, [])

    return (
        <Container>
            <div className='d-flex justify-content-between flex-wrap'>
                <Card className="mb-5" />
                <Card className="mb-5" />
                <Card className="mb-5" />
                <Card className="mb-5" />
                <Card className="mb-5" />
                <Card className="mb-5" />
                <Card className="mb-5" />
                <Card className="mb-5" />
                <Card className="mb-5" />
                <Card className="mb-5" />
            </div>
        </Container >
    )
}
