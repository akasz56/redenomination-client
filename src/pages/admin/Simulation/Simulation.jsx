import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button, Container, Form, Image, Modal, Table } from 'react-bootstrap';
import dayjs from "dayjs";
import "dayjs/locale/id";
import { deleteSimulation, readSimulation } from '../../../adapters/Simulations'
import { createSession } from '../../../adapters/Sessions';
import { imgURL } from '../../../adapters/serverURL';
import LoadingComponent from '../../../components/Loading';
import Error404 from '../../errors/Error404';
import { capitalize } from '../../../Utils';
import './Simulation.css'
import UnitInput from '../../../components/UnitInput';


export default function Simulation() {
    const [loading, setLoading] = useState(true);
    const [dataGet, setDataGet] = useState(false);
    const [dataPost, setDataPost] = useState(false);
    const [modalCreate, setModalCreate] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    const navigate = useNavigate();
    let urlParams = useParams();

    useEffect(() => {
        document.title = "Tidak ada Data";

        async function fetchData() {
            const res = await readSimulation(urlParams.id);
            if (res.status === 200) {
                setDataGet(res.data);
                console.log(res.data);
                setDataPost({
                    "simulationID": res.data.id,
                    "sessionType": "Ulangan Kesekian",
                    "timer": Number(2)
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
            window.location.href = "/sessions/" + res.data.id;
        } else if (res.status === 401) {
            console.log(res);
            window.alert("Tidak diizinkan mengakses");
            setLoading(false)
        } else {
            console.log(res);
            alert("Terjadi Kesalahan, mohon coba lagi");
            setLoading(false)
        }
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
                setLoading(false)
            } else {
                console.log(res);
                alert("Terjadi Kesalahan, mohon coba lagi")
                setLoading(false)
            }
        }
        else { alert("Simulasi gagal dihapus"); }
    }

    function rowHandler(e, id) {
        e.preventDefault();
        navigate('/sessions/' + id);
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

                    <Table responsive hover className="mt-3">
                        <thead>
                            <tr>
                                <th width='50'>No</th>
                                <th width='60%'>Nama Ulangan</th>
                                <th>Tanggal Dibuat</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataGet.sessions.map((item, i) => (
                                <tr key={i} className='simulations' onClick={e => rowHandler(e, item.id)}>
                                    <td className='number'>{i + 1}</td>
                                    <td className='fw-bold'>{capitalize(item.sessionType)}</td>
                                    <td>{dayjs(item.timeCreated).locale("id").format("dddd, D MMM YYYY")}</td>
                                    <td>{item.timeCreated !== item.timeLastRun ?
                                        <span className='fw-bold text-success'>Sudah dijalankan</span>
                                        :
                                        (item.isRunning ? <span>Sedang berjalan</span> : <span className='fw-bold text-primary'>Belum dijalankan</span>)
                                    }</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Button className='w-100 py-lg-2' onClick={showCreateSessionForm}>+ Tambah ulangan</Button>


                    <section style={{ marginTop: "5rem" }} className='row'>
                        <h1>Unit Cost dan Unit Value</h1>
                        <hr />
                        <div className="col-md-6">
                            <p className="fw-bold text-center">Unit Cost</p>
                            {dataGet.sellers.map((_, i) => (
                                <UnitInput
                                    disabled
                                    key={i + 1}
                                    id={i + 1}
                                    role="penjual"
                                    defaultValue={Number(dataGet.sellers[i].unitCost)}
                                />
                            ))}
                        </div>
                        <div className="col-md-6">
                            <p className="fw-bold text-center">Unit Value</p>
                            {dataGet.buyers.map((_, i) => (
                                <UnitInput
                                    disabled
                                    key={i + 1}
                                    id={i + 1}
                                    role="pembeli"
                                    defaultValue={Number(dataGet.buyers[i].unitValue)}
                                />
                            ))}
                        </div>
                    </section>

                    <section style={{ marginTop: "5rem" }} className='info'>
                        <h1>Detail Simulasi</h1>
                        <hr />
                        <div className="details">
                            <p>Jenis Barang : <span className='fw-bold'>{dataGet.goodsType} ({dataGet.goodsName})</span></p>
                            <p>Jenis Inflasi : <span className='fw-bold'>{dataGet.inflationType}</span></p>
                            <p>Anggaran Simulasi : <span className='fw-bold'>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(dataGet.simulationBudget)}</span></p>
                        </div>
                        {dataGet.goodsPic !== '' ?
                            <figure className='d-flex flex-column'>
                                <div className='mx-auto'>
                                    <Image src={(dataGet.goodsPic) ? imgURL + dataGet.goodsPic : ''} fluid alt={dataGet.goodsType} style={{ height: "360px" }} />
                                    <p>Illustrasi barang</p>
                                </div>
                            </figure>
                            :
                            <></>
                        }
                    </section>

                    <section style={{ marginTop: "5rem" }} className='mb-5' >
                        <h1>Hapus Simulasi</h1>
                        <hr />
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
