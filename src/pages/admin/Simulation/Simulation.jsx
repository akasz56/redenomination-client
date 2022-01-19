import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import { deleteSimulation, readSimulation } from '../../../adapters/Simulations'
import { createSession } from '../../../adapters/Sessions'
import { capitalize } from '../../../Utils';
import SummaryComponent from '../../../components/Summary';
import { Button, Container, Form, Image, Modal } from 'react-bootstrap';
import LoadingComponent from '../../../components/Loading';
import dayjs from "dayjs";
import "dayjs/locale/id";
import './Simulation.css'


export default function Simulation() {
    const [dataGet, setDataGet] = useState(false);
    const [dataPost, setDataPost] = useState(false);
    const [modalCreate, setModalCreate] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    let urlParams = useParams();

    useEffect(() => {
        document.title = "No Data";
        readSimulation(urlParams.id)
            .then((value) => {
                setDataGet(value.data);
                setDataPost({
                    "simulationID": value.data.id,
                    "sessionType": "Ulangan Pertama",
                    "timer": value.data.timer
                });
                document.title = "Simulation " + value.data.id;
            })
            .catch((err) => {
                window.alert("Simulasi Tidak ditemukan");
                window.location.href = "/admin";
            })
    }, [urlParams.id]);

    function showCreateSessionForm(e) { setModalCreate(prev => !prev); }
    function showDeleteSessionForm(e) { setModalDelete(prev => !prev); }

    async function submitCreateSession(e) {
        e.preventDefault();
        showCreateSessionForm();

        const res = await createSession(dataPost);
        if (res.status === 201) {
            window.location.reload();
        } else {
            console.log(res);
            alert("Terjadi Kesalahan, mohon coba lagi")
        }
    }

    async function confirmDelete(e) {
        e.preventDefault();
        setModalDelete(prev => !prev);

        if (e.target.elements.confirm.value === capitalize(dataGet.simulationType)) {
            const res = await deleteSimulation(dataGet.id)
            if (res.status === 200) {
                window.location.href = "/admin";
            } else {
                console.log(res);
                alert("Terjadi Kesalahan, mohon coba lagi")
            }
        }
        else { alert("Simulasi gagal dihapus"); }
    }

    if (dataGet)
        return (
            <Container>
                <section className="header mt-5 row">
                    <div className='col-6'>
                        <h1>{capitalize(dataGet.simulationType)}</h1>
                        <div>Token Partisipan: <span className='fw-bold text-primary'>{dataGet.token}</span></div>
                    </div>
                    <div className='col-6 text-end'>
                        <div>
                            {dayjs(dataGet.timeCreated).locale("id").format("dddd, D MMM YYYY")}
                        </div>
                        <Link to='./edit' className="btn btn-outline-dark py-1">edit</Link>
                    </div>
                </section>

                <section className='sessions my-5'>
                    {dataGet.sessions.map((session, index) => (
                        <div key={index}>
                            <span className='fw-bold'>{session.sessionType}</span>
                            <span>{dayjs(session.timeCreated).locale("id").format("dddd, D MMM YYYY")}</span>
                            <Link to={'/sessions/' + session.id}>rincian ulangan...</Link>
                        </div>
                    ))}
                    <Button className='w-100 py-lg-3' onClick={showCreateSessionForm}>+ Tambah ulangan</Button>
                </section>

                <hr />
                <section className='info'>
                    <div>Jenis Barang : <span className='fw-bold'>{dataGet.goodsType} {dataGet.goodsName ? ('(' + dataGet.goodsName + ')') : ''}</span></div>
                    <div>Jenis Inflasi : <span className='fw-bold'>{dataGet.inflationType}</span></div>
                    <div>Timer : <span className='fw-bold'>{dataGet.timer} menit</span></div>
                </section>
                {dataGet.goodsPic ?
                    <section className='info-image'>
                        <Image src={dataGet.goodsPic} fluid></Image>
                    </section>
                    :
                    ''
                }
                <hr />

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

                <hr />
                <section className='my-5'>
                    <h1>Danger Zone</h1>
                    <Button variant="danger" className='mt-3' onClick={showDeleteSessionForm} >Delete Simulation</Button>
                </section>

                <Modal show={modalCreate} onHide={showCreateSessionForm}>
                    <form onSubmit={submitCreateSession}>
                        <Modal.Header closeButton>
                            <Modal.Title>Tambah Ulangan Simulasi</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group controlId="sessionType">
                                <Form.Label className='required'>Nama barang</Form.Label>
                                <Form.Control type="text"
                                    defaultValue={dataPost.sessionType}
                                    required
                                    onChange={(e) => { setDataPost({ ...dataPost, sessionType: e.target.value }) }} />
                            </Form.Group>
                            <Form.Group controlId="timer">
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
                            <Button variant="secondary" onClick={showCreateSessionForm}>
                                Close
                            </Button>
                            <Button variant="primary" type="submit">
                                Save Changes
                            </Button>
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
    else
        return (<LoadingComponent className='child' />)
}