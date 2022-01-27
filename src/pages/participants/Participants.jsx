import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import socket from "../../adapters/SocketIO";
import Ready from "./Ready";
import { PostPriceScreen, SellerIdleScreen } from './posted-offer/Seller';
import { BuyerIdleScreen, FlashSaleScreen } from './posted-offer/Buyer';
import { SellerAuctionScreen, BuyerAuctionScreen } from './double-auction/DoubleAuction';
import { BuyerIdleDS, ListShops, EnterShop, PostPriceDS, SellerIdleDS } from './decentralized/Decentralized';

export default function Participants() {
    const { state } = useLocation();
    const [role] = useState(state.type);
    const [data, setData] = useState(state.detail);
    const [stage, setStage] = useState('');

    useEffect(() => {
        document.title = "simulationType"
        socket.on("serverMessage", res => { console.log("from serverMessage"); console.log(res); })
        if (role === "seller") {
            socket.on("seller", res => { console.log("from seller"); console.log(res); })
        } else if (role === "buyer") {
            socket.on("buyer", res => { console.log("from buyer"); console.log(res); })
        }
    }, [])

    const phaseData = {
        simulationType: "simulationType",
        goodsType: "Elastis",
        goodsName: "Laptop",
        inflationType: "Inflasi Tinggi",
    }

    if (stage === '') {
        return <Ready socket={socket} data={{ ...data, ...phaseData, role: role }} />
    } else {
        if (role === "seller") {
            // PO
            // return <PostPriceScreen socket={socket} data={sellerData} />
            // return <SellerIdleScreen socket={socket} data={sellerData} />
            // return <CompleteScreen socket={socket} data={sellerData} />

            // DA
            // return <SellerAuctionScreen socket={socket} data={sellerData} />
            // return <CompleteScreen socket={socket} data={sellerData} />

            // DS
            // return <PostPriceDS socket={socket} data={sellerData} />
            // return <SellerIdleDS socket={socket} data={sellerData} />
            // return <CompleteScreen socket={socket} data={sellerData} />
        } else if (role === "buyer") {
            // PO
            // return <BuyerIdleScreen socket={socket} data={buyerData} />
            // return <FlashSaleScreen socket={socket} data={buyerData} />
            // return <CompleteScreen socket={socket} data={buyerData} />

            // DA
            // return <BuyerAuctionScreen socket={socket} data={buyerData} />
            // return <CompleteScreen socket={socket} data={buyerData} />

            // DS
            // return <BuyerIdleDS socket={socket} data={buyerData} />
            // return <ListShops socket={socket} data={buyerData} />
            // return <EnterShop socket={socket} data={buyerData} />
            // return <CompleteScreen socket={socket} data={buyerData} />
        }
    }
}

function CompleteScreen() {
    return (
        <Container>
            <h1 className='child'>Simulasi Selesai</h1>
        </Container>
    )
}