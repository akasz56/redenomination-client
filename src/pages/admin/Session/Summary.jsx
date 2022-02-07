import { useEffect, useState } from 'react';
import { readSessionSummary } from '../../../adapters/Sessions';
import dayjs from "dayjs";
import "dayjs/locale/id";
import { displayPrice, getRandomColor } from '../../../Utils';
import 'chart.js/auto';
import { Bar, Scatter } from 'react-chartjs-2';

export default function Summary(props) {
    const [data, setData] = useState(props.data);
    const [dataSummary, setDataSummary] = useState(props.dataSummary);

    useEffect(() => {
        async function fetchSummary(sessionId) {
            const res = await readSessionSummary(sessionId)
            if (res.status === 200) {
                const randomColor = getRandomColor();
                setDataSummary({
                    price: {
                        labels: ["Pre-Redenominasi", "Transisi Redenominasi", "Pasca Transisi Redenominasi"],
                        datasets: [{
                            label: 'Rata-rata Harga kesepakatan',
                            data: res.data.phaseSummary.map((phase) => phase.avgTrxPrice),
                            borderColor: randomColor,
                            backgroundColor: randomColor,
                        }]
                    },
                    trx: {
                        labels: ["Pre-Redenominasi", "Transisi Redenominasi", "Pasca Transisi Redenominasi"],
                        datasets: [{
                            label: 'Jumlah Transaksi',
                            data: res.data.phaseSummary.map((phase) => phase.avgTrxOccurrence),
                            borderColor: randomColor,
                            backgroundColor: randomColor,
                        }]
                    },
                    bargainList: res.data.phaseSummary.map((phase) => {
                        return phase.bargainList.map((bargain, idx) => ({
                            x: idx + 1,
                            y: bargain.price,
                        }))
                    }),
                    trxList: res.data.phaseSummary.map((phase) => {
                        return phase.transactionList.map((trx, idx) => ({
                            x: idx + 1,
                            y: trx.price,
                        }))
                    }),
                });
            } else {
                console.log(res);
                alert("fetch Summary Fail");
            }
        }

        setData(props.data)
        fetchSummary(props.data.id)
    }, [props])

    useEffect(() => {
        console.log(data)
    }, [data])

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
                <>
                    <section className="row mt-5">
                        <div className="col-md-6">
                            <Bar data={dataSummary.trx} />
                        </div>
                        <div className="col-md-6">
                            <Bar data={dataSummary.price} />
                        </div>
                    </section>

                    {data.simulation.simulationType === "double auction" ?
                        <section className='mt-5'>
                            <Scatter data={{
                                datasets: [
                                    {
                                        label: 'Pre-Redenominasi',
                                        data: dataSummary.bargainList[0],
                                        backgroundColor: getRandomColor(),
                                    },
                                    {
                                        label: 'Transisi Redenominasi',
                                        data: dataSummary.bargainList[1],
                                        backgroundColor: getRandomColor(),
                                    },
                                    {
                                        label: 'Pasca Transisi Redenominasi',
                                        data: dataSummary.bargainList[2],
                                        backgroundColor: getRandomColor(),
                                    },
                                ],
                            }} />
                        </section>
                        :
                        <section className='mt-5'>
                            <Scatter data={{
                                datasets: [
                                    {
                                        label: 'Pre-Redenominasi',
                                        data: dataSummary.trxList[0],
                                        backgroundColor: getRandomColor(),
                                    },
                                    {
                                        label: 'Transisi Redenominasi',
                                        data: dataSummary.trxList[1],
                                        backgroundColor: getRandomColor(),
                                    },
                                    {
                                        label: 'Pasca Transisi Redenominasi',
                                        data: dataSummary.trxList[2],
                                        backgroundColor: getRandomColor(),
                                    },
                                ],
                            }} />
                        </section>
                    }

                </>
                :
                ""
            }
        </>
    )
}
