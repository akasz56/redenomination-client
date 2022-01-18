import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import { readSimulation } from '../../../adapters/Simulations'
import { createSession } from '../../../adapters/Sessions'
import { capitalize } from '../../../utils/utils';
import Summary from '../../../components/Summary';
import { Button, Container, Form, Image, Modal } from 'react-bootstrap';
import LoadingComponent from '../../../components/Loading';
import dayjs from "dayjs";
import "dayjs/locale/id";
import './Simulation.css'


export default function Simulation() {
    const [data, setData] = useState(null);
    const [formData, setFormData] = useState({});
    const [showModal, setShowModal] = useState(false);
    let urlParams = useParams();

    useEffect(() => {
        document.title = "No Data";
        readSimulation(urlParams.id).then((value) => {
            setData(value.data);
            setFormData({
                "simulationID": value.data.id,
                "sessionType": "Ulangan Pertama",
                "timer": value.data.timer
            });
            document.title = "Simulation " + value.data.id;
        })
    }, [urlParams.id]);

    function showCreateSessionForm(e) {
        setShowModal(prev => !prev);
    }

    async function submitCreateSession(e) {
        e.preventDefault();
        showCreateSessionForm();
        const res = await createSession(formData);
        if (res.status === 201) {
            window.location.reload();
        } else {
            alert("Terjadi Kesalahan, mohon coba lagi")
            console.log(res);
        }
    }

    if (data)
        return (
            <Container>
                <section className="header mt-5 row">
                    <div className='col-6'>
                        <h1>{capitalize(data.simulationType)}</h1>
                        <div>Token Partisipan: <span className='fw-bold text-primary'>{data.token}</span></div>
                    </div>
                    <div className='col-6 text-end'>
                        <div>
                            {dayjs(data.timeCreated).locale("id").format("dddd, D MMM YYYY")}
                        </div>
                        <Link to='./edit' className="btn btn-outline-dark py-1">edit</Link>
                    </div>
                </section>

                <section className='sessions my-5'>
                    {data.sessions.map((session, index) => (
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
                    <div>Jenis Barang : <span className='fw-bold'>{data.goodsType} {data.goodsName ? ('(' + data.goodsName + ')') : ''}</span></div>
                    <div>Jenis Inflasi : <span className='fw-bold'>{data.inflationType}</span></div>
                    <div>Timer : <span className='fw-bold'>{data.timer} menit</span></div>
                </section>
                {data.goodsPic ?
                    <section className='info-image'>
                        <Image src={data.goodsPic} fluid></Image>
                    </section>
                    :
                    ''
                }
                <hr />

                <section className='summary mt-5'>
                    <h1>Ringkasan Simulasi</h1>
                    <Link to={'./summary'}>rincian simulasi...</Link>
                    <Summary
                        title="Rata-Rata Jumlah transaksi"
                        src="https://via.placeholder.com/400x360"
                        download=""
                    />
                    <Summary
                        title="Rata-rata Harga kesepakatan"
                        src="https://via.placeholder.com/400x360"
                        download=""
                    />
                    <Summary
                        title="Log Tawar-Menawar"
                        src="https://via.placeholder.com/400x360"
                        download=""
                    />
                </section>

                <Modal show={showModal} onHide={showCreateSessionForm}>
                    <form onSubmit={submitCreateSession}>
                        <Modal.Header closeButton>
                            <Modal.Title>Tambah Ulangan Simulasi</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group controlId="sessionType">
                                <Form.Label className='required'>Nama barang</Form.Label>
                                <Form.Control type="text"
                                    defaultValue={formData.sessionType}
                                    required
                                    onChange={(e) => { setFormData({ ...formData, sessionType: e.target.value }) }} />
                            </Form.Group>
                            <Form.Group controlId="timer">
                                <Form.Label className='required'>Timer</Form.Label>
                                <br />
                                <Form.Control type="number" style={{ width: "3.8em", display: "inline" }}
                                    required
                                    defaultValue={formData.timer}
                                    onChange={(e) => { setFormData({ ...formData, timer: e.target.value }) }} />
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
            </Container>
        )
    else
        return (<LoadingComponent className='child' />)

}