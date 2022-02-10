import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import dayjs from "dayjs";
import "dayjs/locale/id";
import { readSession, deleteSession, updateSession, runSession, finishSession } from '../../../adapters/Sessions';
import LoadingComponent from '../../../components/Loading';
import Error404 from '../../errors/Error404';
import { capitalize } from '../../../Utils';
import Summary from './Summary';
import UnitPlayer from '../../../components/UnitPlayer';

export default function Session() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [dataPost, setDataPost] = useState(null);
    const [modalEdit, setModalEdit] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    let urlParams = useParams();

    useEffect(() => {
        document.title = "Tidak ada Data";

        async function fetchData() {
            const res = await readSession(urlParams.id)
            if (res.status === 200) {
                setData(res.data);
                setIsRunning(res.data.isRunning);
                setDataPost({
                    sessionType: res.data.sessionType,
                    timer: res.data.timer
                })
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

    function showEditSessionForm(e) { setModalEdit(prev => !prev); }
    function showDeleteSessionForm(e) { setModalDelete(prev => !prev); }

    async function submitEditSession(e) {
        e.preventDefault();
        showEditSessionForm();

        setLoading(true)
        const res = await updateSession(data.id, dataPost);
        if (res.status === 200) {
            alert("Ulangan berhasil diubah");
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

        if (e.target.elements.confirm.value === capitalize(data.sessionType)) {
            const res = await deleteSession(data.id)
            if (res.status === 200) {
                window.location.href = '/simulations/' + data.simulation.id;
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

    async function startSession(e) {
        e.preventDefault();

        if (window.confirm("Jalankan sesi sekarang?")) {
            const res = await runSession(urlParams.id)
            console.log(res)
            if (res.status === 200) {
                setIsRunning(true)
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
    }

    async function completeSession(e) {
        if (window.confirm("Yakin ingin menghentikan sesi?")) {
            const res = await finishSession(urlParams.id)
            console.log(res)
            if (res.status === 200) {
                setIsRunning(false)
                window.location.reload()
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
    }

    function ViewStart() {
        return (
            <>
                <section>
                    <hr />
                    <div className='text-center mb-3'>
                        <p>Token Partisipan:</p>
                        <p className='fw-bold text-primary fs-3'>{data.simulation.token}</p>
                    </div>
                    <Link to='#' className="btn btn-primary w-100 p-4" onClick={startSession} >Jalankan Ulangan</Link>
                    <hr />
                </section>

                <section className='my-5'>
                    <h1>Hapus Ulangan</h1>
                    <Button variant="danger" onClick={showDeleteSessionForm}>Hapus Ulangan</Button>
                </section>
            </>
        )
    }

    function ViewRun() {
        const [participant] = useState({
            sellers: data.simulation.sellers,
            buyers: data.simulation.buyers
        });

        return (
            <>
                <section>
                    <hr />
                    <div className='text-center mb-3'>
                        <p>Token Partisipan:</p>
                        <p className='fw-bold text-primary fs-3'>{data.simulation.token}</p>
                    </div>
                    <Link to='#' className="btn btn-danger w-100 p-4" onClick={completeSession} >Hentikan Ulangan</Link>
                    <hr />
                </section>

                <section style={{ marginTop: "5rem" }} className='row'>
                    <h1>Peserta</h1>
                    <hr />
                    <div className="col-md-6">
                        <p className="fw-bold text-center">Daftar Penjual</p>
                        {participant.sellers.map((item, i) => (
                            <UnitPlayer
                                key={i + 1}
                                id={i + 1}
                                role="penjual"
                                item={item}
                            />
                        ))}
                    </div>
                    <div className="col-md-6">
                        <p className="fw-bold text-center">Daftar Pembeli</p>
                        {participant.buyers.map((item, i) => (
                            <UnitPlayer
                                key={i + 1}
                                id={i + 1}
                                role="pembeli"
                                item={item}
                            />
                        ))}
                    </div>
                </section>
            </>
        )
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
                            {(data.timeLastRun === data.timeCreated && !isRunning) ?
                                <Button variant="outline-dark" className='py-1' onClick={showEditSessionForm}>edit</Button>
                                :
                                ''
                            }
                        </div>
                    </section>

                    <section className='mt-4 text-center'>
                        <p>Timer : <span className='fw-bold'>{data.timer} menit</span></p>
                    </section>

                    {(data.timeLastRun === data.timeCreated) ?
                        (isRunning ? <ViewRun /> : <ViewStart />)
                        :
                        <Summary data={data} />
                    }

                    <Modal show={modalEdit} onHide={showEditSessionForm}>
                        <form onSubmit={submitEditSession}>
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
                                <Button variant="secondary" onClick={showEditSessionForm}>Close</Button>
                                <Button variant="primary" type="submit">Save Changes</Button>
                            </Modal.Footer>
                        </form>
                    </Modal>

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

                    <section className='my-5'>
                        <h1>Hapus Ulangan</h1>
                        <Button variant="danger" onClick={showDeleteSessionForm}>Hapus Ulangan</Button>
                    </section>
                </Container>
            )
        } else { return <Error404 /> }
    }
}