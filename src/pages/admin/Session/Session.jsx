import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import { readSession } from '../../../adapters/Sessions';
import Summary from '../../../components/Summary';
import { Container } from 'react-bootstrap'

export default function Session() {
    const [data, setData] = useState(null);
    let urlParams = useParams();

    useEffect(() => {
        document.title = "No Data";
        readSession(urlParams.id).then((value) => {
            setData(value);
            document.title = value.sessionID + " " + value.sessionType;
        })
    }, [urlParams.id]);

    if (data)
        return (
            <Container>
                <section className="header mt-5 row">
                    <div className="col-6">
                        <h1>{data.sessionType}</h1>
                        <p>SimulationID: {data.simulationID}</p>
                    </div>
                    <div className="col-6 text-end">
                        <div>{data.timeCreated}</div>
                        <Link to='#' className="btn btn-primary">Jalankan Sesi</Link>
                    </div>
                </section>
                <hr />

                <section className='summary mt-5'>
                    <h1>Ringkasan Simulasi</h1>
                    <Link to={'./summary'}>rincian simulasi...</Link>
                    <Summary
                        title="Rata-Rata Jumlah transaksi"
                        src="https://via.placeholder.com/400x360"
                        download=""
                    />
                    <Summary
                        title="Rata-rata Harga kesepakatan"
                        src="https://via.placeholder.com/400x360"
                        download=""
                    />
                    <Summary
                        title="Log Tawar-Menawar"
                        src="https://via.placeholder.com/400x360"
                        download=""
                    />
                </section>
            </Container>
        )
    else
        return (
            <section className="parent">
                <div className="child">
                    <h1>Tidak ada Data</h1>
                </div>
            </section>
        )
}