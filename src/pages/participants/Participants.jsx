import { useEffect } from 'react'
import { Container } from 'react-bootstrap';
import Ready from "./Ready";
import { PostPriceScreen, SellerIdleScreen } from './posted-offer/Seller';
import { BuyerIdleScreen, FlashSaleScreen } from './posted-offer/Buyer';
import { SellerAuctionScreen, BuyerAuctionScreen } from './double-auction/doubleAuction';
import { BuyerIdleDS, ListShops, EnterShop, PostPriceDS, SellerIdleDS } from './decentralized/Decentralized';

export default function Participants() {

    function generateSeller(num = 1) {
        let sellers = [];
        for (let i = 1; i <= num; i++) {
            sellers.push({
                role: "Penjual " + i,
                price: Math.floor(Math.random() * 100) * 100,
                // status: "wait"
                status: "done"
                // status: "decentralized"
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
        seller: generateSeller(10),

        role: "Penjual",
        unitCost: 3700,
    }

    const buyerData = {
        simulationType: "simulationType",
        goodsType: "Elastis",
        goodsName: "Laptop",
        inflationType: "Inflasi Tinggi",

        phase: "Sebelum Redenominasi",
        minPrice: 3700,
        maxPrice: 8900,
        seller: generateSeller(10),

        role: "Pembeli",
        unitValue: 8900,
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
    // return <CompleteScreen data={sellerData} />

    // DA Buyer
    // return <BuyerAuctionScreen data={buyerData} />
    // return <CompleteScreen data={buyerData} />


    // DS Seller
    // return <PostPriceDS data={sellerData} />
    // return <SellerIdleDS data={sellerData} />
    // return <CompleteScreen data={sellerData} />

    // DS Buyer
    // return <BuyerIdleDS data={buyerData} />
    // return <ListShops data={buyerData} />
    return <EnterShop data={buyerData} />
    // return <CompleteScreen data={buyerData} />

    return <div />
}

function CompleteScreen() {
    return (
        <Container>
            <h1 className='child'>Simulasi Selesai</h1>
        </Container>
    )
}