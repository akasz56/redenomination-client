import { useState, useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import socket from "../../adapters/SocketIO";
import Label from "../../components/Label";
import LoadingComponent from "../../components/Loading";
import { capitalize, displayPrice, logout } from "../../Utils";

export default function CompleteScreenHandler({ data }) {
    const [rewards, setRewards] = useState(0)

    useEffect(() => {
        function collectedProfitHandler(res) {
            setRewards(res);
            socket.off("collectedProfit");
        }
        socket.emit("collectProfit", {
            phaseId: data.phases[0].id,
            username: data.detail.username,
        })
        socket.once("collectedProfit", collectedProfitHandler);
    }, [data])

    return <CompleteScreen data={{ ...data, rewards: rewards }} />
}

function CompleteScreen({ data }) {
    return (
        <Container className='text-center d-flex flex-column'>
            <h1 className='text-center mt-5'>Ulangan Selesai</h1>
            {(data.rewards) ?
                <p className='mt-5'>
                    Selamat, anda mendapatkan hadiah sebesar
                    <span className='text-primary fw-bolder fs-1 d-block'>{displayPrice(data.rewards)}</span>
                </p>
                :
                <LoadingComponent className="mx-auto my-5" />
            }

            <section className="mx-auto mt-4">
                <Button variant="danger" className="px-4 py-3 fs-3" onClick={(e) => {
                    e.preventDefault();
                    logout(window.location.href = "/")
                }}>
                    Kembali
                </Button>
            </section>

            <Label
                className="mt-5 mx-auto"
                complete={true}
                phase={capitalize(data.simulationType) + " (" + data.detail.loginToken + ")"}
                goods={data.goodsType + " (" + capitalize(data.goodsName) + ")"}
                inflation={data.inflationType}
            />
        </Container>
    )
}