import { Container } from 'react-bootstrap';
import SummaryComponent from '../../../components/Summary';
import UnitShow from '../../../components/UnitShow';

export default function Summary() {
    return (
        <Container>
            <section className='mt-5'>
                <h1>Ringkasan Simulasi</h1>
                <p>SimulationID: data.id</p>
            </section>

            <hr className='mt-5' />
            <section className='row'>
                <div className="col-md-6 text-center">
                    <p>Rata-rata jumlah transaksi Simulasi</p>
                    <h1 className='text-primary fw-bolder'>4</h1>
                </div>
                <div className="col-md-6 text-center">
                    <p>Rata-rata harga kesepakatan Simulasi</p>
                    <h1 className='text-primary fw-bolder'>Rp. 8900</h1>
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
                    {Array.from({ length: 5 }).map((_, i) => (
                        <UnitShow key={i + 1} id={i + 1} role="penjual" />
                    ))}
                </div>
                <div className="col-md-6">
                    <p className="fw-bold text-center">Unit Value</p>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <UnitShow key={i + 1} id={i + 1} role="pembeli" />
                    ))}
                </div>
            </section>
        </Container>
    )
}
