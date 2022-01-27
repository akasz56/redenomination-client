import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import dayjs from "dayjs";
import "dayjs/locale/id";
import { readSession, deleteSession } from '../../../adapters/Sessions';
import LoadingComponent from '../../../components/Loading';
import SummaryComponent from '../../../components/Summary';
import Error404 from '../../errors/Error404';
import { myToken, capitalize } from '../../../Utils';

export default function Session() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [modalDelete, setModalDelete] = useState(false);
    let urlParams = useParams();

    useEffect(() => {
        document.title = "Tidak ada Data";

        async function fetchData() {
            const res = await readSession(urlParams.id)
            if (res.status === 200) {
                setData(res.data);
                setLoading(false)
                document.title = "Ulangan " + res.data.id;
            } else if (res.status === 401) {
                setLoading(false)
                console.log(res);
                window.alert("Tidak diizinkan mengakses");
            } else if (res.status === 404) {
                window.alert("Ulangan tidak ditemukan");
                window.location.href = "/admin";
            } else {
                setLoading(false)
                console.log(res);
                alert("Terjadi Kesalahan");
            }
        }
        fetchData();
    }, [urlParams.id]);

    function runSession() {
        if (window.confirm("Jalankan sesi sekarang?")) {
            const sentSocket = {
                authentication: myToken(),
                sessionData: data,
            };
            console.log(sentSocket)
        }
    }

    function showDeleteSessionForm(e) { setModalDelete(prev => !prev); }

    async function confirmDelete(e) {
        e.preventDefault();
        setModalDelete(prev => !prev);

        if (e.target.elements.confirm.value === capitalize(data.sessionType)) {
            const res = await deleteSession(data.id)
            if (res.status === 200) {
                window.location.href = "/admin";
            } else if (res.status === 401) {
                console.log(res);
                window.alert("Tidak diizinkan mengakses");
            } else {
                console.log(res);
                alert("Terjadi Kesalahan, mohon coba lagi")
            }
        }
        else { alert("Simulasi gagal dihapus"); }
    }

    if (loading) { return (<LoadingComponent className='child' />) }
    else {
        if (data) {
            return (
                <Container>
                    <section className="header mt-5 row">
                        <div className="col-9">
                            <h1>{data.sessionType}</h1>
                            <p className='mb-0'>SimulationID: <Link to={'/simulations/' + data.simulation.id}>{data.simulation.id}</Link></p>
                        </div>
                        <div className="col-3 text-end">
                            <div>{dayjs(data.timeCreated).locale("id").format("dddd, D MMM YYYY")}</div>
                        </div>
                    </section>

                    {data.timeLastRun !== null ?
                        <section>
                            <hr />
                            <Link to='#' className="btn btn-primary w-100 p-4" onClick={runSession} >Jalankan Sesi</Link>
                            <hr />
                        </section>
                        :
                        <section className='summary'>
                            <hr style={{ marginTop: "7rem" }} />
                            <h1>Ringkasan Simulasi</h1>
                            <Link to={'./summary'}>rincian simulasi...</Link>
                            <div className='d-flex flex-column flex-xl-row justify-content-around'>
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
                            </div>
                        </section>
                    }

                    <section className='my-5'>
                        <h1>Hapus Ulangan</h1>
                        <Button variant="danger" onClick={showDeleteSessionForm}>Hapus Ulangan</Button>
                    </section>

                    <Modal show={modalDelete} onHide={showDeleteSessionForm} centered>
                        <form onSubmit={confirmDelete}>
                            <Modal.Header closeButton>
                                <Modal.Title>Konfirmasi Hapus Ulangan</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form.Group controlId="confirm">
                                    <p>Aksi ini <strong>tidak dapat dibatalkan</strong>. Ketik ulang Tipe Simulasi untuk mengkonfirmasi anda benar-benar ingin menghapus.</p>
                                    <Form.Control required placeholder={capitalize(data.sessionType)} name="confirm" />
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant='secondary' onClick={showDeleteSessionForm}>Batalkan</Button>
                                <Button variant='danger' type="submit">Konfirmasi Hapus</Button>
                            </Modal.Footer>
                        </form>
                    </Modal>
                </Container>
            )
        } else { return <Error404 /> }
    }
}