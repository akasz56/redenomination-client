// unit value unit cost belum selesai
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { readSession } from '../../../adapters/Sessions';
import { readSimulation } from '../../../adapters/Simulations';
import LoadingComponent from '../../../components/Loading';
import SummaryComponent from '../../../components/Summary';
import UnitShow from '../../../components/UnitShow';

export default function Summary() {
    const [data, setData] = useState(false);

    useEffect(() => {
        document.title = "No Data";
        const id = getIDfromLink(window.location.pathname)
        readSession(id)
            .then((value) => {
                setData(value.data);
                document.title = "Ringkasan Session " + value.data.id;
                readSimulation(value.data.simulation.id)
                    .then((res) => { setData({ ...value.data, simulation: res.data }); })
                    .catch(catchErr)
            })
            .catch(catchErr)
    }, []);

    function catchErr() {
        window.alert("Simulasi Tidak ditemukan");
        window.history.back();
    }

    function getIDfromLink(string) {
        const words = string.split("/");
        return words[2];
    }

    if (data)
        return (
            <Container>
                <section className='mt-5'>
                    <h1>Ringkasan Sesi</h1>
                    <p>SessionID: <Link to={'/sessions/' + data.id}>{data.id}</Link></p>
                </section>

                <section className='d-flex justify-content-around'>
                    <button className='btn btn-link' onClick={() => { window.location.replace("#phasePre"); }}>Sebelum Redenominasi</button>
                    <button className='btn btn-link' onClick={() => { window.location.replace("#phaseTransition"); }}>Transisi Redenominasi</button>
                    <button className='btn btn-link' onClick={() => { window.location.replace("#phasePost"); }}>Setelah Redenominasi</button>
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
                        {Array.from({ length: data.simulation.participantNumber / 2 }).map((_, i) => (
                            <UnitShow key={i + 1} id={i + 1}
                                role="penjual"
                            // price={data.simulation.sellers[i].unitCost}
                            />
                        ))}
                    </div>
                    <div className="col-md-6">
                        <p className="fw-bold text-center">Unit Value</p>
                        {Array.from({ length: data.simulation.participantNumber / 2 }).map((_, i) => (
                            <UnitShow key={i + 1} id={i + 1}
                                role="pembeli"
                            // price={data.simulation.buyers[i].unitValue}
                            />
                        ))}
                    </div>
                </section>

                <hr className='mt-5' />
                <button className='btn btn-link' onClick={() => { window.location.replace("#"); }}>Kembali ke atas</button>
                <section className='row' id="phasePre">
                    <h1 className='mb-3'>Sebelum Redenominasi</h1>
                    <div className="col-md-6 text-center">
                        <p>Jumlah Transaksi</p>
                        <h1 className='text-primary fw-bolder'>{data.avgTrxOccurrence}</h1>
                    </div>
                    <div className="col-md-6 text-center">
                        <p>Rata-rata Harga kesepakatan</p>
                        <h1 className='text-primary fw-bolder'>Rp. {data.avgTrxPrice}</h1>
                    </div>
                </section>

                <hr className='mt-5' />
                <button className='btn btn-link' onClick={() => { window.location.replace("#"); }}>Kembali ke atas</button>
                <section className='row' id="phaseTransition">
                    <h1 className='mb-3'>Transisi Redenominasi</h1>
                    <div className="col-md-6 text-center">
                        <p>Jumlah Transaksi</p>
                        <h1 className='text-primary fw-bolder'>{data.avgTrxOccurrence}</h1>
                    </div>
                    <div className="col-md-6 text-center">
                        <p>Rata-rata Harga kesepakatan</p>
                        <h1 className='text-primary fw-bolder'>Rp. {data.avgTrxPrice}</h1>
                    </div>
                </section>

                <hr className='mt-5' />
                <button className='btn btn-link' onClick={() => { window.location.replace("#"); }}>Kembali ke atas</button>
                <section className='row' id="phasePost">
                    <h1 className='mb-3'>Setelah Redenominasi</h1>
                    <div className="col-md-6 text-center">
                        <p>Jumlah Transaksi</p>
                        <h1 className='text-primary fw-bolder'>{data.avgTrxOccurrence}</h1>
                    </div>
                    <div className="col-md-6 text-center">
                        <p>Rata-rata Harga kesepakatan</p>
                        <h1 className='text-primary fw-bolder'>Rp. {data.avgTrxPrice}</h1>
                    </div>
                </section>
            </Container>
        )
    else
        return (<LoadingComponent className='child' />)
}
