import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import { readSimulation } from '../../adapters/Simulations'
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

                <section className="header mt-5">
                    <div>
                        <h1>{data.simulationType}</h1>
                        <p>
                            Token Partisipan:&nbsp;
                            <span className='fw-bold text-primary'>{data.token}</span>
                        </p>
                    </div>
                    <div className='date fs-5'>{data.date}</div>
                </section>

                <section className='sessions my-5'>
                    {data.sessions.map((session, index) => (
                        <div key={index}>
                            <span className='fw-bold'>{session.sessionType}</span>
                            <span>{session.date}</span>
                            <Link to={'./sessions/' + session.sessionID}>rincian ulangan...</Link>
                        </div>
                    ))}
                </section>

                <hr />
                <section className='info'>
                    <div>Jenis Barang : <span className='fw-bold'>{data.goodsType}</span></div>
                    <div>Jenis Inflasi : <span className='fw-bold'>{data.inflationType}</span></div>
                    <div>Timer : <span className='fw-bold'>{data.timer}</span></div>
                </section>
                <hr />

                <section className='summary mt-5'>
                    <h1>Ringkasan Simulasi</h1>
                    <Link to={'#'}>rincian simulasi...</Link>
                    <Summary
                        title="Rata-Rata Jumlah transaksi"
                        src="https://via.placeholder.com/400x360"
                        download="#"
                    />
                    <Summary
                        title="Rata-rata Harga kesepakatan"
                        src="https://via.placeholder.com/400x360"
                        download="#"
                    />
                    <Summary
                        title="Log Tawar-Menawar"
                        src="https://via.placeholder.com/400x360"
                        download="#"
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

function Summary(props) {
    return (
        <div className='mt-4 d-flex flex-column'>
            <span className='text-center fs-4'>{props.title}</span>
            <Image className='mx-auto' src={props.src}></Image>
            <a className='text-end' href={props.download}>download rincian...</a>
        </div>
    )
}
