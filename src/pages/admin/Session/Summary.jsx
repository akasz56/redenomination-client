import { useEffect, useState, useMemo } from 'react';
import { readSessionSummary } from '../../../adapters/Sessions';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import dayjs from "dayjs";
import "dayjs/locale/id";
import { capitalize, displayPrice, getRandomColor } from '../../../Utils';
import ScatterSummary from '../../../components/ScatterSummary';
import UnitProfit from '../../../components/UnitProfit';
import { CSVLink } from 'react-csv';

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
                            y: parseInt(bargain.price),
                        }))
                    }),
                    trxList: res.data.phaseSummary.map((phase) => {
                        return phase.transactionList.map((trx, idx) => ({
                            x: idx + 1,
                            y: parseInt(trx.price),
                        }))
                    }),
                });
            } else {
                console.log(res);
                alert("fetch Summary Fail");
            }
        }

        setData(props.data)
        if (props.data.id) {
            fetchSummary(props.data.id)
        }
    }, [props])

    const nameArr = useMemo(() => [
        dayjs(data.timeLastRun).locale("id").format("dddd, D MMM YYYY"),
        capitalize(data.simulation.simulationType),
        data.sessionType
    ], [data])

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
                            <CSVLink
                                filename={'Jumlah Transaksi ' + capitalize(data.simulation.simulationType) + " " + dayjs(data.simulation.timeCreated).locale("id").format("dddd, D MMM YYYY")}
                                data={[
                                    dataSummary.trx.labels,
                                    ...dataSummary.trx.datasets.map(dataset => [...dataset.data])
                                ]}>Download CSV</CSVLink>
                        </div>
                        <div className="col-md-6">
                            <Bar data={dataSummary.price} />
                            <CSVLink
                                filename={'Harga Kesepakatan Transaksi ' + capitalize(data.simulation.simulationType) + " " + dayjs(data.simulation.timeCreated).locale("id").format("dddd, D MMM YYYY")}
                                data={[
                                    dataSummary.price.labels,
                                    ...dataSummary.price.datasets.map(dataset => [...dataset.data])
                                ]}>Download CSV</CSVLink>
                        </div>
                    </section>

                    {data.simulation.simulationType === "double auction" ?
                        <section className='mt-5'>
                            <ScatterSummary data={dataSummary.bargainList} labels={dataSummary.price.labels} nameArr={nameArr} />
                        </section>
                        :
                        <section className='mt-5'>
                            <ScatterSummary data={dataSummary.trxList} labels={dataSummary.price.labels} nameArr={nameArr} />
                        </section>
                    }
                </>
                :
                ""
            }

            <UnitProfit buyers={data.simulation.buyers} sellers={data.simulation.sellers} budget={data.simulation.simulationBudget} />
        </>
    )
}
