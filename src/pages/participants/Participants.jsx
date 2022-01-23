import { useEffect } from 'react'
import { Container } from 'react-bootstrap';
import { io } from 'socket.io-client';
import Ready from "./Ready";
import { PostPriceScreen, SellerIdleScreen } from './posted-offer/Seller';
import { BuyerIdleScreen, FlashSaleScreen } from './posted-offer/Buyer';
import { SellerAuctionScreen, BuyerAuctionScreen } from './double-auction/doubleAuction';
import { ListChatroom, JoinChatroom } from './decentralized/Decentralized';
import serverURL from '../../adapters/serverURL';

export default function Participants() {
    // const socket = io.connect("http://localhost:8000/");

    //------------------------------ Data section
    function generateSeller(num = 1) {
        let sellers = [];
        for (let i = 1; i <= num; i++) {
            sellers.push({
                role: "Penjual " + i,
                price: Math.floor(Math.random() * 100) * 100,
                status: "decentralized"
            })
        }
        return sellers;
    }

    const sellerData = {
        simulationType: "simulationType",
        goodsType: "Elastis",
        goodsName: "Laptop",
        inflationType: "Inflasi Tinggi",

        phase: "Sebelum Redenominasi",
        minPrice: 3700,
        maxPrice: 8900,

        role: "Penjual",
        unitCost: 3700,
        seller: generateSeller(10),
    }

    const buyerData = {
        simulationType: "simulationType",
        goodsType: "Elastis",
        goodsName: "Laptop",
        inflationType: "Inflasi Tinggi",

        phase: "Sebelum Redenominasi",
        minPrice: 3700,
        maxPrice: 8900,

        role: "Pembeli",
        unitValue: 8900,
        seller: generateSeller(10),
    }

    useEffect(() => {
        document.title = "simulationType"
    }, [])

    // Waiting
    // return <Ready data={sellerData} />
    // return <Ready data={buyerData} />


    // PO Seller
    // return <PostPriceScreen data={sellerData} />
    // return <SellerIdleScreen data={sellerData} />
    // return <CompleteScreen data={sellerData} />

    // PO Buyer
    // return <BuyerIdleScreen data={buyerData} />
    // return <FlashSaleScreen data={buyerData} />
    // return <CompleteScreen data={buyerData} />


    // DA Seller
    // return <SellerAuctionScreen data={sellerData} />

    // DA Buyer
    // return <BuyerAuctionScreen data={buyerData} />


    // DS Seller
    return <JoinChatroom data={sellerData} />

    // DS Buyer
    // return <ListChatroom data={buyerData} />
}

function CompleteScreen() {
    return (
        <Container>
            <h1 className='child'>Simulasi Selesai</h1>
        </Container>
    )
}