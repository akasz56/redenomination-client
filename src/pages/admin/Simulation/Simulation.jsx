import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import { readSimulation } from '../../../adapters/Simulations'
import Summary from '../../../components/Summary';
import { Container, Image } from 'react-bootstrap'
import './Simulation.css'

export default function Simulation() {
    const [data, setData] = useState(null);
    let urlParams = useParams();

    useEffect(() => {
        document.title = "No Data";
        readSimulation(urlParams.id).then((value) => {
            setData(value);
            document.title = value.simulationID + " " + value.simulationType;
        })
    }, [urlParams.id]);

    if (data)
        return (
            <Container>
                <section className="header mt-5 row">
                    <div className='col-6'>
                        <h1>{data.simulationType}</h1>
                        <div>Token Partisipan: <span className='fw-bold text-primary'>{data.token}</span></div>
                    </div>
                    <div className='col-6 text-end'>
                        <div>{data.timeCreated}</div>
                        <Link to='./edit' className="btn btn-outline-dark py-1">edit</Link>
                    </div>
                </section>

                <section className='sessions my-4'>
                    {data.sessions.map((session, index) => (
                        <div key={index}>
                            <span className='fw-bold'>{session.sessionType}</span>
                            <span>{session.timeCreated}</span>
                            <Link to={'./sessions/' + session.sessionID}>rincian ulangan...</Link>
                        </div>
                    ))}
                </section>

                <hr />
                <section className='info'>
                    <div>Jenis Barang : <span className='fw-bold'>{data.goodsType} {data.goodsName ? ('(' + data.goodsName + ')') : ''}</span></div>
                    <div>Jenis Inflasi : <span className='fw-bold'>{data.inflationType}</span></div>
                    <div>Timer : <span className='fw-bold'>{data.timer} menit</span></div>
                </section>
                {data.goodsPic ?
                    <section className='info-image'>
                        <Image src={data.goodsPic} fluid></Image>
                    </section>
                    :
                    ''
                }
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