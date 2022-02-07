import { useEffect, useState } from 'react';
import { readSessionSummary } from '../../../adapters/Sessions';
import dayjs from "dayjs";
import "dayjs/locale/id";
import { displayPrice } from '../../../Utils';
import 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

export default function Summary(props) {
    const [data, setData] = useState(props.data);
    const [dataSummary, setDataSummary] = useState(props.dataSummary);

    useEffect(() => {
        async function fetchSummary(sessionId) {
            const res = await readSessionSummary(sessionId)
            if (res.status === 200) {
                setDataSummary({
                    price: {
                        labels: ["Pre-Redenominasi", "Transisi Redenominasi", "Pasca Transisi Redenominasi"],
                        datasets: [{
                            label: 'Rata-rata Harga kesepakatan',
                            data: res.data.phaseSummary.map((phase) => phase.avgTrxPrice),
                            borderColor: 'rgb(255, 99, 132)',
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        }]
                    },
                    trx: {
                        labels: ["Pre-Redenominasi", "Transisi Redenominasi", "Pasca Transisi Redenominasi"],
                        datasets: [{
                            label: 'Jumlah Transaksi',
                            data: res.data.phaseSummary.map((phase) => phase.avgTrxOccurrence),
                            borderColor: 'rgb(255, 99, 132)',
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        }]
                    }
                });
            } else {
                console.log(res);
                alert("fetch Summary Fail");
            }
        }

        setData(props.data)
        fetchSummary(props.data.id)
    }, [props])

    return (
        <>
            <section className='text-center'>
                <h1>Ringkasan Ulangan</h1>
                <p className='mb-0'>Terakhir dijalankan: {dayjs(data.timeLastRun).locale("id").format("dddd, D MMM YYYY, HH:mm:ss")}</p>
            </section>

            <hr />

            <section className='row'>
                <div className="col-md-6 text-center">
                    <p>Rata-rata jumlah transaksi</p>
                    <h1 className='text-primary fw-bolder'>{data.avgTrxOccurrence}</h1>
                </div>
                <div className="col-md-6 text-center">
                    <p>Rata-rata harga kesepakatan</p>
                    <h1 className='text-primary fw-bolder'>{displayPrice(data.avgTrxPrice)}</h1>
                </div>
            </section>

            {dataSummary ?
                <section className="row mt-5">
                    <div className="col-md-6">
                        <Bar data={dataSummary.trx} />
                    </div>
                    <div className="col-md-6">
                        <Bar data={dataSummary.price} />
                    </div>
                </section>
                :
                <></>
            }
        </>
    )
}
