import { useEffect } from 'react'
import { PostPriceScreen, SellerIdleScreen, SellerCompleteScreen } from './posted-offer/Seller';
import { BuyerIdleScreen, FlashSaleScreen, BuyerCompleteScreen } from './posted-offer/Buyer';
import Ready from "./Ready";

export default function Participants() {
    useEffect(() => {
        document.title = "Posted Offer"
    }, [])

    // Waiting
    // return <Ready data={data} />

    // PO Seller
    // return <PostPriceScreen />
    // return <SellerIdleScreen />
    // return <SellerCompleteScreen />

    // PO Buyer
    // return <BuyerIdleScreen />
    // return <FlashSaleScreen />
    // return <BuyerCompleteScreen />
}