import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { readSimulation } from '../../../adapters/Simulations';
import LoadingComponent from '../../../components/Loading';
import SummaryComponent from '../../../components/Summary';
import UnitShow from '../../../components/UnitShow';
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Link } from 'react-router-dom';

export default function Summary() {
    const [data, setData] = useState(false);

    useEffect(() => {
        document.title = "No Data";
        const id = getIDfromLink(window.location.pathname)
        readSimulation(id)
            .then((value) => {
                setData(value.data);
                document.title = "Ringkasan Session " + value.data.id;
            })
            .catch((err) => {
                window.alert("Simulasi Tidak ditemukan");
                window.location.href = "/admin";
            })
    }, []);

    function getIDfromLink(string) {
        const words = string.split("/");
        return words[2];
    }

    if (data)
        return (
            <Container>
                <section className='mt-5'>
                    <h1>Ringkasan Simulasi</h1>
                    <p className='mb-0'>SimulationID: <Link to={'/sessions/' + data.id}>{data.id}</Link></p>
                    <p className='mb-0'>Terakhir dijalankan: {dayjs(data.timeLastRun).locale("id").format("DD-MM-YY HH:mm:ss")}</p>
                </section>

                <hr className='mt-5' />
                <section className='row'>
                    <div className="col-md-6 text-center">
                        <p>Rata-rata jumlah transaksi Simulasi</p>
                        <h1 className='text-primary fw-bolder'>{data.avgTrxOccurrence}</h1>
                    </div>
                    <div className="col-md-6 text-center">
                        <p>Rata-rata harga kesepakatan Simulasi</p>
                        <h1 className='text-primary fw-bolder'>Rp. {data.avgTrxPrice}</h1>
                    </div>
                </section>
                <hr />

                <section className='d-flex flex-column flex-xl-row justify-content-around'>
                    <SummaryComponent
                        title="Rata-Rata Jumlah transaksi"
                        src="https://via.placeholder.com/400x360"
                        download=""
                    />
                    <SummaryComponent
                        title="Rata-rata Harga kesepakatan"
                        src="https://via.placeholder.com/400x360"
                        download=""
                    />
                    <SummaryComponent
                        title="Log Tawar-Menawar"
                        src="https://via.placeholder.com/400x360"
                        download=""
                    />
                </section>

                <hr className='mt-5' />

                <section className="row">
                    <h1>Unit Cost dan Unit Value</h1>
                    <div className="col-md-6">
                        <p className="fw-bold text-center">Unit Cost</p>
                        {Array.from({ length: data.participantNumber / 2 }).map((_, i) => (
                            <UnitShow key={i + 1} id={i + 1}
                                role="penjual"
                                price={data.sellers[i].unitCost}
                            />
                        ))}
                    </div>
                    <div className="col-md-6">
                        <p className="fw-bold text-center">Unit Value</p>
                        {Array.from({ length: data.participantNumber / 2 }).map((_, i) => (
                            <UnitShow key={i + 1} id={i + 1}
                                role="pembeli"
                                price={data.buyers[i].unitValue}
                            />
                        ))}
                    </div>
                </section>
            </Container>
        )
    else
        return (<LoadingComponent className='child' />)

}
