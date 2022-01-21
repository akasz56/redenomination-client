import { useEffect } from 'react'
import { Container } from 'react-bootstrap'
import Card from '../../../components/Card'
import Label from '../../../components/Label'

//------------------------------ Data section
function generateSeller(num = 1) {
    let sellers = [];
    for (let i = 1; i <= num; i++) {
        sellers.push({
            role: "Penjual " + i,
            status: 'decentralized'
        })
    }
    return sellers;
}

const API = {
    role: "Buyer",
    goodsType: "Elastis",
    goodsName: "Laptop",
    inflationType: "Inflasi Tinggi",
}
const socket = {
    phase: "Sebelum Redenominasi",
    unitCost: 8700,
    seller: generateSeller(10),
}

//------------------------------ Screens
export function ListChatroom() {

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
                {socket.seller.map((item, i) => (
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
                phase={socket.phase}
                goods={API.goodsType + " (" + API.goodsName + ")"}
                inflation={API.inflationType}
            />
        </Container >
    )
}

export function JoinChatroom() {
    return (
        <Container>

        </Container>
    );
}
