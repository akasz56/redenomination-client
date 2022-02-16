import { useEffect } from "react";
import socket from "../../adapters/SocketIO";

export default function newConceptParticipants() {
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

    return (
        <div>newConceptParticipants</div>
    )
}

function DAHandler() { }
function POHandler() { }
function DSHandler() { }