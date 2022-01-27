import { Container } from 'react-bootstrap'
import Card from '../../../components/Card'
import Label from '../../../components/Label'
import { capitalize } from '../../../Utils'

export function BuyerIdleScreen({ socket, data }) {
    return (
        <Container className='text-center d-flex flex-column'>
            <p className='mt-5'>Anda mendapat <span className='fw-bolder'>Unit Value</span> sebesar</p>
            <h1 className='mb-4 mb-xl-5 text-primary fw-bolder'>Rp. {data.unitValue}</h1>

            <p className='mt-5'>menunggu penjual memasang harga......</p>

            <Label
                className="mt-5 mx-auto"
                phase={data.phase}
                goods={data.goodsType + " (" + capitalize(data.goodsName) + ")"}
                inflation={data.inflationType}
            />
        </Container >
    )
}

export function FlashSaleScreen({ socket, data }) {
    return (
        <Container className='text-center d-flex flex-column'>
            <p className='mt-5'>Anda mendapat <span className='fw-bolder'>Unit Value</span> sebesar</p>
            <h1 className='mb-4 mb-xl-5 text-primary fw-bolder'>Rp. {data.unitValue}</h1>

            <section className='mt-5 d-flex justify-content-between flex-wrap'>
                {data.seller.map((item, i) => (
                    <Card
                        key={i}
                        variant={item.status}
                        className="mb-3"
                        role={item.role}
                        onBtnClick={(e) => { console.log(item) }}
                    >
                        Rp. {item.price}
                    </Card>
                ))}
            </section>

            <Label
                className="mt-5 mx-auto"
                phase={data.phase}
                goods={data.goodsType + " (" + capitalize(data.goodsName) + ")"}
                inflation={data.inflationType}
            />
        </Container >
    );
}