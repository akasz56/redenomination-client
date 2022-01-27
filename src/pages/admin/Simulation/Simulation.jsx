import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import { Button, Container, Form, Image, Modal } from 'react-bootstrap';
import dayjs from "dayjs";
import "dayjs/locale/id";
import { deleteSimulation, readSimulation } from '../../../adapters/Simulations'
import { createSession } from '../../../adapters/Sessions';
import { imgURL } from '../../../adapters/serverURL';
import SummaryComponent from '../../../components/Summary';
import LoadingComponent from '../../../components/Loading';
import Error404 from '../../errors/Error404';
import { capitalize } from '../../../Utils';
import './Simulation.css'


export default function Simulation() {
    const [loading, setLoading] = useState(true);
    const [dataGet, setDataGet] = useState(false);
    const [dataPost, setDataPost] = useState(false);
    const [modalCreate, setModalCreate] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    let urlParams = useParams();

    useEffect(() => {
        document.title = "Tidak ada Data";

        async function fetchData() {
            const res = await readSimulation(urlParams.id);
            if (res.status === 200) {
                setDataGet(res.data);
                setDataPost({
                    "simulationID": res.data.id,
                    "sessionType": "Ulangan Kesekian",
                    "timer": res.data.timer
                });
                setLoading(false)
                document.title = "Simulasi " + res.data.id;
            } else if (res.status === 401) {
                setLoading(false)
                console.log(res);
                window.alert("Tidak diizinkan mengakses");
            } else if (res.status === 404) {
                window.alert("Simulasi tidak ditemukan");
                window.location.href = "/admin";
            } else {
                setLoading(false)
                console.log(res);
                alert("Terjadi Kesalahan");
            }
        }
        fetchData();
    }, [urlParams.id]);

    function showCreateSessionForm(e) { setModalCreate(prev => !prev); }
    function showDeleteSessionForm(e) { setModalDelete(prev => !prev); }

    async function submitCreateSession(e) {
        e.preventDefault();
        showCreateSessionForm();

        setLoading(true)
        const res = await createSession(dataPost);
        if (res.status === 201) {
            alert("Ulangan berhasil dibuat");
            window.location.reload();
        } else if (res.status === 401) {
            console.log(res);
            window.alert("Tidak diizinkan mengakses");
        } else {
            console.log(res);
            alert("Terjadi Kesalahan, mohon coba lagi");
        }
        setLoading(false)
    }

    async function confirmDelete(e) {
        e.preventDefault();
        setModalDelete(prev => !prev);

        if (e.target.elements.confirm.value === capitalize(dataGet.simulationType)) {
            setLoading(true)
            const res = await deleteSimulation(dataGet.id)
            if (res.status === 200) {
                window.location.href = "/admin";
            } else if (res.status === 401) {
                console.log(res);
                window.alert("Tidak diizinkan mengakses");
            } else {
                console.log(res);
                alert("Terjadi Kesalahan, mohon coba lagi")
            }
            setLoading(false)
        }
        else { alert("Simulasi gagal dihapus"); }
    }

    if (loading) return (<LoadingComponent className='child' />)
    else {
        if (dataGet) {
            return (
                <Container>
                    <section className="header mt-5 row">
                        <div className='col-6'>
                            <h1>{capitalize(dataGet.simulationType)}</h1>
                            <div>Token Partisipan: <span className='fw-bold text-primary'>{dataGet.token}</span></div>
                        </div>
                        <div className='col-6 text-end'>
                            <div>{dayjs(dataGet.timeCreated).locale("id").format("dddd, D MMM YYYY")}</div>
                            <Link to='./edit' className="btn btn-outline-dark py-1">edit</Link>
                        </div>
                    </section>

                    <section className='sessions'>
                        {dataGet.sessions.map((session, index) => (
                            <div key={index} className='d-flex justify-content-around mb-3'>
                                <span className='fw-bold'>{session.sessionType}</span>
                                <span>{dayjs(session.timeCreated).locale("id").format("dddd, D MMM YYYY")}</span>
                                <Link to={'/sessions/' + session.id}>rincian ulangan...</Link>
                            </div>
                        ))}
                        <div>
                            <Button className='w-100 py-lg-2' onClick={showCreateSessionForm}>+ Tambah ulangan</Button>
                        </div>
                    </section>

                    <hr style={{ marginTop: "7rem" }} />
                    <section className='info'>
                        <h1>Detail Simulasi</h1>
                        <div className="details">
                            <p>Jenis Barang : <span className='fw-bold'>{dataGet.goodsType} ({dataGet.goodsName})</span></p>
                            <p>Jenis Inflasi : <span className='fw-bold'>{dataGet.inflationType}</span></p>
                            <p>Timer : <span className='fw-bold'>{dataGet.timer} menit</span></p>
                        </div>
                        {dataGet.goodsPic !== '' ?
                            <figure className='info-image'>
                                <Image src={(dataGet.goodsPic) ? imgURL + dataGet.goodsPic : ''} fluid></Image>
                                <figcaption>Illustrasi barang</figcaption>
                            </figure>
                            :
                            <></>
                        }
                    </section>

                    <hr style={{ marginTop: "7rem" }} />
                    <section>
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

                    <hr style={{ marginTop: "7rem" }} />
                    <section className='mb-5'>
                        <h1>Hapus Simulasi</h1>
                        <Button variant="danger" className='mt-3' onClick={showDeleteSessionForm}>Hapus Simulasi</Button>
                    </section>

                    <Modal show={modalCreate} onHide={showCreateSessionForm}>
                        <form onSubmit={submitCreateSession}>
                            <Modal.Header closeButton>
                                <Modal.Title>Tambah Ulangan Simulasi</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form.Group controlId="sessionType">
                                    <Form.Label className='required'>Nama Sesi</Form.Label>
                                    <Form.Control type="text"
                                        defaultValue={dataPost.sessionType}
                                        required
                                        onChange={(e) => { setDataPost({ ...dataPost, sessionType: e.target.value }) }} />
                                </Form.Group>
                                <Form.Group controlId="timer" className='mt-3'>
                                    <Form.Label className='required'>Timer</Form.Label>
                                    <br />
                                    <Form.Control type="number" style={{ width: "3.8em", display: "inline" }}
                                        required
                                        defaultValue={dataPost.timer}
                                        onChange={(e) => { setDataPost({ ...dataPost, timer: e.target.value }) }} />
                                    &nbsp;Menit
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={showCreateSessionForm}>Close</Button>
                                <Button variant="primary" type="submit">Save Changes</Button>
                            </Modal.Footer>
                        </form>
                    </Modal>

                    <Modal show={modalDelete} onHide={showDeleteSessionForm} centered>
                        <form onSubmit={confirmDelete}>
                            <Modal.Header closeButton>
                                <Modal.Title>Konfirmasi Hapus Simulasi</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form.Group controlId="confirm">
                                    <p>Aksi ini <strong>tidak dapat dibatalkan</strong>. Ketik ulang Tipe Simulasi untuk mengkonfirmasi anda benar-benar ingin menghapus.</p>
                                    <Form.Control required placeholder={capitalize(dataGet.simulationType)} name="confirm" />
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