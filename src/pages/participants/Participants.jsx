import { useEffect, useReducer } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import socket from "../../adapters/SocketIO";
import { capitalize, logout, printLog, sortPhases } from "../../Utils";
import BlankScreen from "./BlankScreen";

function PostedOfferHandler() { }
function DoubleAuctionHandler() { }
function DecentralizedHandler() { }

export default function Participants() {
    const { state } = useLocation();

    // Tab Title
    useEffect(() => {
        document.title = capitalize(state.simulationType);
    }, [state.simulationType]);

    // Message from Server Handler
    useEffect(() => {
        socket.on("serverMessage", res => {
            if (res.status === 401) {
                window.alert("Anda belum terdaftar dalam server, silahkan coba masukkan token partisipan lagi");
                logout(() => { window.location.reload("/"); });
            } else if (res.status !== 200) {
                printLog(res)
            }
        })

        return () => {
            socket.off("serverMessage")
        }
    }, []);

    switch (phaseData.simulationType) {
        case "Posted Offer":
            return <PostedOfferHandler data={{ ...state }} />
        case "Double Auction":
            return <DoubleAuctionHandler data={{ ...state }} />
        case "Decentralized":
            return <DecentralizedHandler data={{ ...state }} />
        default:
            return <BlankScreen lineNumber="000" />
    }
}
