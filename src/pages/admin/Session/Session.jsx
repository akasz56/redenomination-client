import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import { Container } from 'react-bootstrap'
import dayjs from "dayjs";
import "dayjs/locale/id";
import { readSession } from '../../../adapters/Sessions';
import LoadingComponent from '../../../components/Loading';
import SummaryComponent from '../../../components/Summary';
import Error404 from '../../errors/Error404';

export default function Session() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    let urlParams = useParams();

    useEffect(() => {
        document.title = "Tidak ada Data";

        async function fetchData() {
            const res = await readSession(urlParams.id)
            if (res.status === 200) {
                setData(res.data);
                setLoading(false)
                document.title = "Ulangan " + res.data.id;
            } else if (res.status === 401) {
                setLoading(false)
                console.log(res);
                window.alert("Tidak diizinkan mengakses");
            } else if (res.status === 404) {
                window.alert("Ulangan tidak ditemukan");
                window.location.href = "/admin";
            } else {
                setLoading(false)
                console.log(res);
                alert("Terjadi Kesalahan");
            }
        }
        fetchData();
    }, [urlParams.id]);

    function runSession() {
        if (window.confirm("Jalankan sesi sekarang?")) {
            console.log("yes")
        }
    }

    if (loading) { return (<LoadingComponent className='child' />) }
    else {
        if (data) {
            return (
                <Container>
                    <section className="header mt-5 row">
                        <div className="col-9">
                            <h1>{data.sessionType}</h1>
                            <p className='mb-0'>SimulationID: <Link to={'/simulations/' + data.simulation.id}>{data.simulation.id}</Link></p>
                        </div>
                        <div className="col-3 text-end">
                            <div>{dayjs(data.timeCreated).locale("id").format("dddd, D MMM YYYY")}</div>
                        </div>
                    </section>

                    {data.timeLastRun !== null ?
                        <section>
                            <hr />
                            <Link to='#' className="btn btn-primary w-100 p-4" onClick={runSession} >Jalankan Sesi</Link>
                            <hr />
                        </section>
                        :
                        <section className='summary'>
                            <hr style={{ marginTop: "7rem" }} />
                            <h1>Ringkasan Simulasi</h1>
                            <Link to={'./summary'}>rincian simulasi...</Link>
                            <div className='d-flex flex-column flex-xl-row justify-content-around'>
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
                            </div>
                        </section>
                    }
                </Container>
            )
        } else { return <Error404 /> }
    }
}