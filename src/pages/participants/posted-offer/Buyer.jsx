import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import Card from '../../../components/Card'
import Label from '../../../components/Label'
import { capitalize } from '../../../Utils'

export function BuyerIdleScreen({ socket, data, setStage }) {
    return (
        <Container className='text-center d-flex flex-column'>
            <p className='mt-5'>Anda mendapat <span className='fw-bolder'>Unit Value</span> sebesar</p>
            <h1 className='mb-4 mb-xl-5 text-primary fw-bolder'>Rp. {data.unitValue}</h1>

            <p className='mt-5'>menunggu penjual memasang harga......</p>

            <Label
                className="mt-5 mx-auto"
                phase={data.phaseName}
                goods={data.goodsType + " (" + capitalize(data.goodsName) + ")"}
                inflation={data.inflationType}
            />
        </Container >
    )
}

export function FlashSaleScreen({ socket, data, setStage, checkPhase }) {
    const [seller, setSeller] = useState(data.seller);
    const [hasBought, setHasBought] = useState(false);
    const [countSold, setCountSold] = useState(0);

    useEffect(() => {
        let count = 0;
        socket.on("postedOfferList", (res) => {
            const temp = res.map((item, i) => {
                count = (item.isSold) ? (count + 1) : count;
                return {
                    sellerId: item.sellerId,
                    role: "Penjual " + (i + 1),
                    price: item.price,
                    status: (item.isSold) ? "done" : "",
                    postedOfferId: item.id
                }
            })
            setSeller(temp)
            setCountSold(count)
            console.log(count)
        })

        if (countSold === (data.participantNumber / 2)) {
            checkPhase();
        }
        // if (timer || all seller sold) {
        //     checkPhase()
        // }

        return () => {
            socket.off("postedOfferList")
        }
    })

    function buyHandler(e, item) {
        e.preventDefault();

        let unitValueCheck = data.unitValue
        switch (data.currentPhase.phaseType) {
            case "transitionPrice":
                unitValueCheck = data.unitValue.split(" / ")
                if (window.confirm("yakin membeli?") && (item.price <= unitValueCheck[0] || item.price <= unitValueCheck[1])) {
                    socket.emit("po:buy", {
                        postedOfferId: item.postedOfferId,
                        phaseId: data.currentPhase.id
                    })
                    setHasBought(true)
                }
                break;
            case "postRedenomPrice":
                let itemPrice = item.price / 1000
                if (window.confirm("yakin membeli?") && itemPrice <= unitValueCheck) {
                    socket.emit("po:buy", {
                        postedOfferId: item.postedOfferId,
                        phaseId: data.currentPhase.id
                    })
                    setHasBought(true)
                }
                break;

            default:
                if (window.confirm("yakin membeli?") && item.price <= unitValueCheck) {
                    socket.emit("po:buy", {
                        postedOfferId: item.postedOfferId,
                        phaseId: data.currentPhase.id
                    })
                    setHasBought(true)
                }
                break;
        }

    }

    return (
        <Container className='text-center d-flex flex-column'>
            <p className='mt-5'>Anda mendapat <span className='fw-bolder'>Unit Value</span> sebesar</p>
            <h1 className='mb-4 mb-xl-5 text-primary fw-bolder'>Rp. {data.unitValue}</h1>

            <section className='mt-5 d-flex justify-content-between flex-wrap'>
                {seller.map((item, i) => (
                    <Card
                        key={i}
                        variant={(item.status === "done") ? "done" : ((hasBought) ? 'wait' : '')}
                        className="mb-3"
                        role={item.role}
                        onBtnClick={(e) => { buyHandler(e, item) }}
                    >
                        Rp. {item.price}
                    </Card>
                ))}
            </section>

            <Label
                className="mt-5 mx-auto"
                phase={data.phaseName}
                goods={data.goodsType + " (" + capitalize(data.goodsName) + ")"}
                inflation={data.inflationType}
            />
        </Container >
    );
}