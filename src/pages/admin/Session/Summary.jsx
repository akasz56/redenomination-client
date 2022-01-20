// unit value unit cost belum selesai
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import dayjs from "dayjs";
import "dayjs/locale/id";
import { readSession } from '../../../adapters/Sessions';
import { readSimulation } from '../../../adapters/Simulations';
import LoadingComponent from '../../../components/Loading';
import SummaryComponent from '../../../components/Summary';
import UnitShow from '../../../components/UnitShow';
import Error404 from '../../errors/Error404';

export default function Summary() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(false);

    useEffect(() => {
        document.title = "No Data";

        function getIDfromLink(string) {
            const words = string.split("/");
            return words[2];
        }

        async function fetchData() {
            const id = getIDfromLink(window.location.pathname)
            const res = await readSession(id)
            if (res.status === 200) {
                document.title = "Ringkasan Ulangan " + res.data.id;
                const res1 = await readSimulation(res.data.simulation.id)
                if (res1.status === 200) {
                    setData({ ...res.data, simulation: res1.data });
                    setLoading(false)
                } else if (res1.status === 401) {
                    setLoading(false)
                    console.log(res1);
                    window.alert("Tidak diizinkan mengakses");
                } else if (res1.status === 404) {
                    window.alert("Simulasi tidak ditemukan");
                    window.history.back();
                } else {
                    setLoading(false)
                    console.log(res1);
                    alert("Terjadi Kesalahan");
                }
            } else if (res.status === 401) {
                setLoading(false)
                console.log(res);
                window.alert("Tidak diizinkan mengakses");
            } else if (res.status === 404) {
                window.alert("Ulangan tidak ditemukan");
                window.history.back();
            } else {
                setLoading(false)
                console.log(res);
                alert("Terjadi Kesalahan");
            }
        }

        fetchData();
    }, []);

    if (loading) return (<LoadingComponent className='child' />)
    else {
        if (data) {
            return (
                <Container>
                    <section className='mt-5'>
                        <h1>Ringkasan Ulangan</h1>
                        <p className='mb-0'>SessionID: <Link to={'/sessions/' + data.id}>{data.id}</Link></p>
                        <p className='mb-0'>Terakhir dijalankan: {dayjs(data.timeLastRun).locale("id").format("DD-MM-YY HH:mm:ss")}</p>
                    </section>

                    <hr />
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
                    <section className='row' id="phasePre">
                        <h1 className='mb-3 text-center'>Sebelum Redenominasi</h1>
                        <div className="col-md-6 text-center">
                            <p>Jumlah Transaksi</p>
                            <h1 className='text-primary fw-bolder'>{data.avgTrxOccurrence}</h1>
                        </div>
                        <div className="col-md-6 text-center">
                            <p>Rata-rata Harga kesepakatan</p>
                            <h1 className='text-primary fw-bolder'>Rp. {data.avgTrxPrice}</h1>
                        </div>
                    </section>

                    <hr />
                    <section className='row' id="phaseTransition">
                        <h1 className='mb-3 text-center'>Transisi Redenominasi</h1>
                        <div className="col-md-6 text-center">
                            <p>Jumlah Transaksi</p>
                            <h1 className='text-primary fw-bolder'>{data.avgTrxOccurrence}</h1>
                        </div>
                        <div className="col-md-6 text-center">
                            <p>Rata-rata Harga kesepakatan</p>
                            <h1 className='text-primary fw-bolder'>Rp. {data.avgTrxPrice}</h1>
                        </div>
                    </section>

                    <hr />
                    <section className='row' id="phasePost">
                        <h1 className='mb-3 text-center'>Setelah Redenominasi</h1>
                        <div className="col-md-6 text-center">
                            <p>Jumlah Transaksi</p>
                            <h1 className='text-primary fw-bolder'>{data.avgTrxOccurrence}</h1>
                        </div>
                        <div className="col-md-6 text-center">
                            <p>Rata-rata Harga kesepakatan</p>
                            <h1 className='text-primary fw-bolder'>Rp. {data.avgTrxPrice}</h1>
                        </div>
                    </section>

                    <hr />
                    <section className='mt-5 d-flex flex-column flex-xl-row justify-content-around'>
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

                    <hr style={{ marginTop: "5rem" }} />
                    <section className="row">
                        <h1>Unit Cost dan Unit Value</h1>
                        <div className="col-md-6">
                            <p className="fw-bold text-center">Unit Cost</p>
                            {Array.from({ length: data.simulation.participantNumber / 2 }).map((_, i) => (
                                <UnitShow key={i + 1} id={i + 1}
                                    role="penjual"
                                    price={data.simulation.sellers[i].unitCost}
                                />
                            ))}
                        </div>
                        <div className="col-md-6">
                            <p className="fw-bold text-center">Unit Value</p>
                            {Array.from({ length: data.simulation.participantNumber / 2 }).map((_, i) => (
                                <UnitShow key={i + 1} id={i + 1}
                                    role="pembeli"
                                    price={data.simulation.buyers[i].unitValue}
                                />
                            ))}
                        </div>
                    </section>
                </Container>
            )
        } else { return <Error404 /> }
    }
}
