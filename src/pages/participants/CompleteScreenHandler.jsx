import { useState } from "react";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import socket from "../../adapters/SocketIO";
import Label from "../../components/Label";
import LoadingComponent from "../../components/Loading";
import { capitalize } from "../../Utils";

export default function CompleteScreenHandler({ data }) {
    const [rewards, setRewards] = useState(0)

    useEffect(() => {
        function collectedProfitHandler(res) {
            setRewards(res);
            socket.off("collectedProfit");
        }
        socket.emit("collectProfit", { participantId: data.detail.id })
        socket.once("collectedProfit", collectedProfitHandler);
    }, [data])

    return <CompleteScreen data={{ ...data, rewards: rewards }} />
}

function CompleteScreen({ data }) {
    const kontak = "6289608703393"

    function roundparseInt(number) {
        const rounding = 100
        return Math.floor(number / rounding) * rounding;
    }

    function generateLink() {
        return "https://wa.me/" + kontak + "?text=Saya menerima reward sebesar " + data.rewards + " dalam simulasi " + data.simulationType + " (" + data.detail.loginToken + ")"
    }

    return (
        <Container className='text-center d-flex flex-column'>
            <h1 className='text-center mt-5'>Simulasi Selesai</h1>
            {(data.rewards >= 0) ?
                <p className='mt-5'>
                    Selamat, anda mendapatkan hadiah sebesar
                    <span className='text-primary fw-bolder fs-1 d-block'>Rp. {roundparseInt(data.rewards)}</span>
                    Silahkan klik tombol dibawah untuk menghubungi peneliti
                </p>
                :
                <LoadingComponent className="mx-auto my-5" />
            }

            <div className="mx-auto mt-4">
                <a href={generateLink()} className='btn btn-primary px-4 py-3 fs-3' target="_blank" rel="noreferrer">Kontak</a>
            </div>

            <Label
                className="mt-5 mx-auto"
                phase={capitalize(data.simulationType) + " (" + data.detail.loginToken + ")"}
                goods={data.goodsType + " (" + capitalize(data.goodsName) + ")"}
                inflation={data.inflationType}
            />
        </Container>
    )
}