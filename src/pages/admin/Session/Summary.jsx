import { useEffect, useState } from 'react';
import dayjs from "dayjs";
import "dayjs/locale/id";
import { readSimulation } from '../../../adapters/Simulations'
import UnitInput from '../../../components/UnitInput';
import LoadingComponent from '../../../components/Loading';
import Error404 from '../../errors/Error404';
import { displayPrice } from '../../../Utils';
import 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

export default function Summary(props) {
    const [data, setData] = useState(props.data);
    const [dataSummary, setDataSummary] = useState(props.dataSummary);

    useEffect(() => {
        setData(props.data)
        setDataSummary(props.dataSummary)
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
                    <h1 className='text-primary fw-bolder'>{Number(data.avgTrxOccurrence)}</h1>
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
