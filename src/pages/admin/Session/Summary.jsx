import { useEffect, useState } from 'react';
import dayjs from "dayjs";
import "dayjs/locale/id";
import { readSimulation } from '../../../adapters/Simulations'
import UnitInput from '../../../components/UnitInput';
import LoadingComponent from '../../../components/Loading';
import Error404 from '../../errors/Error404';
import { displayPrice } from '../../../Utils';

export default function Summary(props) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(props.data);

    useEffect(() => {
        document.title = "Ringkasan Ulangan " + data.id;
        async function fetchData() {
            const res = await readSimulation(data.simulation.id)
            if (res.status === 200) {
                setData({ ...data, simulation: res.data });
                setLoading(false)
            } else if (res.status === 401) {
                setLoading(false)
                console.log(res);
                window.alert("Tidak diizinkan mengakses");
            } else if (res.status === 404) {
                window.alert("Simulasi tidak ditemukan");
                window.history.back();
            } else {
                setLoading(false)
                console.log(res);
                alert("Terjadi Kesalahan");
            }
        }
        fetchData();
    }, [data]);

    if (loading) return (<LoadingComponent className='child' />)
    else {
        if (data) {
            return (
                <>
                    <section className='text-center'>
                        <h1>Ringkasan Ulangan</h1>
                        <p className='mb-0'>Terakhir dijalankan: {dayjs(data.timeLastRun).locale("id").format("DD-MM-YY HH:mm:ss")}</p>
                        <div className="d-flex justify-content-center">
                            <a href="#avgTrxOccurrence" className='btn btn-link mt-3 px-2'>Jumlah Transaksi</a>
                            <a href="#avgTrxPrice" className='btn btn-link mt-3 px-2'>Harga Kesepakatan</a>
                            <a href="#costValue" className='btn btn-link mt-3 px-2'>Unit Cost dan Unit Value</a>
                        </div>
                    </section>

                    <hr />
                    <section className='row'>
                        <div className="col-md-6 text-center">
                            <p>Rata-rata jumlah transaksi</p>
                            <h1 className='text-primary fw-bolder'>{Number(data.avgTrxOccurrence)}</h1>
                        </div>
                        <div className="col-md-6 text-center">
                            <p>Rata-rata harga kesepakatan</p>
                            <h1 className='text-primary fw-bolder'>Rp. {Number(data.avgTrxPrice)}</h1>
                        </div>
                    </section>

                    <section className='row' style={{ marginTop: "7rem" }} id="avgTrxOccurrence">
                        <h1 className='mb-3 text-center'>Jumlah Transaksi</h1>
                        <hr />
                        <div className="col-md-4 text-center">
                            <p>Pre-Redenominasi</p>
                            <h1 className='text-primary fw-bolder'>{Number(data.phases[0].avgTrxOccurrence)}</h1>
                        </div>
                        <div className="col-md-4 text-center">
                            <p>Transisi Redenominasi</p>
                            <h1 className='text-primary fw-bolder'>{Number(data.phases[1].avgTrxOccurrence)}</h1>
                        </div>
                        <div className="col-md-4 text-center">
                            <p>Pasca Transisi Redenominasi</p>
                            <h1 className='text-primary fw-bolder'>{Number(data.phases[2].avgTrxOccurrence)}</h1>
                        </div>
                    </section>

                    <section className='row' style={{ marginTop: "7rem" }} id="avgTrxPrice">
                        <h1 className='mb-3 text-center'>Harga kesepakatan</h1>
                        <hr />
                        <div className="col-md-4 text-center">
                            <p>Pre-Redenominasi</p>
                            <h1 className='text-primary fw-bolder'>Rp. {displayPrice(data.phases[0].avgTrxPrice, "preRedenomPrice")}</h1>
                        </div>
                        <div className="col-md-4 text-center">
                            <p>Transisi Redenominasi</p>
                            <h1 className='text-primary fw-bolder'>Rp. {displayPrice(data.phases[1].avgTrxPrice, "transitionPrice")}</h1>
                        </div>
                        <div className="col-md-4 text-center">
                            <p>Pasca Transisi Redenominasi</p>
                            <h1 className='text-primary fw-bolder'>Rp. {displayPrice(data.phases[2].avgTrxPrice, "postRedenomPrice")}</h1>
                        </div>
                    </section>

                    <section className="row" style={{ marginTop: "7rem" }} id="costValue">
                        <h1 className='text-center'>Unit Cost dan Unit Value</h1>
                        <hr />
                        <div className="col-md-6 text-center">
                            <p>Unit Cost</p>
                            {data.simulation.sellers.map((item, i) => (
                                <UnitInput
                                    disabled
                                    key={i + 1}
                                    id={i + 1}
                                    role="penjual"
                                    defaultValue={Number(item.unitCost)}
                                />
                            ))}
                        </div>
                        <div className="col-md-6 text-center">
                            <p>Unit Value</p>
                            {data.simulation.buyers.map((item, i) => (
                                <UnitInput
                                    disabled
                                    key={i + 1}
                                    id={i + 1}
                                    role="penjual"
                                    defaultValue={Number(item.unitValue)}
                                />
                            ))}
                        </div>
                    </section>
                </>
            )
        } else { return <Error404 /> }
    }
}
