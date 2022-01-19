import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import { Container } from 'react-bootstrap'
import { readSession } from '../../../adapters/Sessions';
import LoadingComponent from '../../../components/Loading';
import SummaryComponent from '../../../components/Summary';
import dayjs from "dayjs";
import "dayjs/locale/id";

export default function Session() {
    const [data, setData] = useState(null);
    let urlParams = useParams();

    useEffect(() => {
        document.title = "No Data";
        readSession(urlParams.id).then((value) => {
            setData(value.data);
            document.title = "Session " + value.data.id;
        })
    }, [urlParams.id]);

    function runSession() {
        if (window.confirm("Jalankan sesi sekarang?")) {
            console.log("yes")
        }
    }

    if (data)
        return (
            <Container>
                <section className="header mt-5 row">
                    <div className="col-9">
                        <h1>{data.sessionType}</h1>
                        <p>SimulationID: {data.id}</p>
                    </div>
                    <div className="col-3 text-end">
                        <div>{dayjs(data.timeCreated).locale("id").format("dddd, D MMM YYYY")}</div>
                    </div>
                </section>
                <hr />
                <Link to='#' className="btn btn-primary w-100 p-4" onClick={runSession} >Jalankan Sesi</Link>

                <section className='summary mt-5'>
                    <h1>Ringkasan Simulasi</h1>
                    <Link to={'./summary'}>rincian simulasi...</Link>
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
            </Container>
        )
    else
        return (<LoadingComponent className='child' />)
}