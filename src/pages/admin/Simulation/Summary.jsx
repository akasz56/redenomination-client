import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import dayjs from "dayjs";
import "dayjs/locale/id";
import { readSimulation } from '../../../adapters/Simulations';
import LoadingComponent from '../../../components/Loading';
import SummaryComponent from '../../../components/Summary';
import UnitShow from '../../../components/UnitShow';
import Error404 from '../../errors/Error404';

export default function Summary() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(false);

    useEffect(() => {
        document.title = "Tidak ada Data";

        async function fetchData() {
            const id = getIDfromLink(window.location.pathname)
            const res = await readSimulation(id)
            if (res.status === 200) {
                setData(res.data);
                document.title = "Ringkasan Simulasi " + res.data.id;
            } else if (res.status === 401) {
                setLoading(false)
                console.log(res);
                window.alert("Tidak diizinkan mengakses");
            } else if (res.status === 404) {
                window.alert("Simulasi tidak ditemukan");
                window.location.href = "/admin";
            } else {
                setLoading(false)
                console.log(res);
                alert("Terjadi Kesalahan");
            }
        }
        fetchData();
    }, []);

    function getIDfromLink(string) {
        const words = string.split("/");
        return words[2];
    }

    if (loading) return (<LoadingComponent className='child' />)
    else {
        if (data) {
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
        } else { return <Error404 /> }
    }
}