import { useEffect } from 'react'
import { Container } from 'react-bootstrap'
import Card from '../../../components/Card'
import Label from '../../../components/Label'

export function ListChatroom({ data }) {

    useEffect(() => {
        document.title = "Decentralized"
    }, [])

    function clickHandler(item) {
        console.log(item.role);
    }

    return (
        <Container className='text-center d-flex flex-column'>
            <h3 className='mt-5'>Silahkan <span className='fw-bold'>Pilih Penjual</span> untuk bernegosiasi</h3>
            <section className='mt-5 d-flex justify-content-between flex-wrap'>
                {data.seller.map((item, i) => (
                    <Card
                        key={i}
                        variant={item.status}
                        className="mb-3"
                        role={item.role}
                        onBtnClick={(e) => { clickHandler(item) }}
                    />
                ))}
            </section>

            <Label
                className="mt-5 mx-auto"
                phase={data.phase}
                goods={data.goodsType + " (" + data.goodsName + ")"}
                inflation={data.inflationType}
            />
        </Container >
    )
}

export function JoinChatroom({ data }) {
    return (
        <Container>

        </Container>
    );
}
