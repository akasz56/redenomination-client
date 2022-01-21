import { useEffect } from 'react'
import { PostPriceScreen, SellerIdleScreen } from './posted-offer/Seller';
import { BuyerIdleScreen, FlashSaleScreen } from './posted-offer/Buyer';
import SellerAuctionScreen from './double-auction/Seller';
import BuyerAuctionScreen from './double-auction/Buyer';
import { ListChatroom, JoinChatroom } from './decentralized/Decentralized';
// import Ready from "./Ready";

export default function Participants() {
    useEffect(() => {
        document.title = "Posted Offer"
        // document.title = "Double Auction"
        // document.title = "Decentralized"
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


    // DA Seller
    // return <SellerAuctionScreen />

    // DA Buyer
    // return <BuyerAuctionScreen />


    // DS Seller
    // return <JoinChatroom />

    // DS Buyer
    return <ListChatroom />
}

// function CompleteScreen() {
//     return (
//         <Container>
//             <h1 className='child'>Simulasi Selesai</h1>
//         </Container>
//     )
// }



// connection
// room = loginToken
