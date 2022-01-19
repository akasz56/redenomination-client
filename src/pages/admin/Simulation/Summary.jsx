import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SummaryComponent from '../../../components/Summary';

export default function Summary() {
    return (
        <Container>
            <section className='summary mt-5'>
                <h1>Ringkasan Simulasi</h1>
                <Link to={'./summary'}>rincian simulasi...</Link>
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
        </Container>
    )
}
