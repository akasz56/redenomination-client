import { useEffect, useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { createSimulation, uploadPicture } from '../../../adapters/Simulations';
import LoadingComponent from '../../../components/Loading';
import UnitInput from '../../../components/UnitInput';
import { numberInputFormat, printLog } from '../../../Utils';

export default function Create() {
    const [loading, setLoading] = useState(false);
    const [togglePlayer, setTogglePlayer] = useState(true);
    const [fileSend, setFileSend] = useState(null);
    const [unitValues, setUnitValues] = useState({});
    const [unitCosts, setUnitCosts] = useState({});
    const [formData, setFormData] = useState({
        simulationType: "Posted Offer",
        goodsType: "Inelastis",
        goodsName: '',
        inflationType: "Inflasi Rendah",
        participantNumber: 20,
        simulationBudget: 200000,
    });

    useEffect(() => {
        document.title = "Buat Simulasi baru";
    }, [])

    function budgetHandler(e) {
        const value = numberInputFormat(e, e.target.value)
        setFormData({ ...formData, simulationBudget: value });
    }

    function togglePlayerHandler(e) {
        e.preventDefault();
        setTogglePlayer(prev => !prev);
    }

    function additionalPlayerHandler(e, isSeller) {
        e.preventDefault();
        const value = numberInputFormat(e, e.target.value);
        if (isSeller) {
            setUnitValues({ ...unitValues, ["pembeli" + (formData.participantNumber / 2 + 0.5)]: undefined });
            setUnitCosts({ ...unitCosts, ["penjual" + (formData.participantNumber / 2 + 0.5)]: value });
        } else {
            setUnitCosts({ ...unitCosts, ["penjual" + (formData.participantNumber / 2 + 0.5)]: undefined });
            setUnitValues({ ...unitValues, ["pembeli" + (formData.participantNumber / 2 + 0.5)]: value });
        }
    }

    function fileHandler(e) {
        e.preventDefault();
        setFileSend(e.target.files[0])
    }

    async function submitForm(e) {
        e.preventDefault();
        const additionalPlayer = ((formData.participantNumber % 2) ? (togglePlayer ? "seller" : "buyer") : false)

        const temp = JSON.stringify({ ...formData, unitCost: unitCosts, unitValue: unitValues })
        const body = JSON.parse(temp)

        setLoading(true)
        const res = await createSimulation(body, additionalPlayer);
        if (res.status === 201) {
            await uploadPic(res.data.id);
            window.location.href = "/simulations/" + res.data.id;
        } else if (res.status === 401) {
            printLog(res);
            setLoading(false)
            window.alert("Tidak diizinkan mengakses");
        } else {
            printLog(res);
            setLoading(false)
            alert("Terjadi Kesalahan, mohon coba lagi")
        }
    }

    async function uploadPic(id) {
        let pic = new FormData()
        pic.append('file', fileSend)
        const res = await uploadPicture(id, pic);
        if (res.status === 201) {
            return res.data.goodsPic;
        } else {
            printLog(res);
            window.alert("Foto gagal diupload");
            return null;
        }
    }

    if (loading) return (<LoadingComponent className='child' />)
    else {
        return (
            <Container>
                <form onSubmit={submitForm}>
                    <h1 className='mt-5'>Simulasi Baru</h1>

                    <Form.Group controlId='type' className="mb-3">
                        <Form.Label className='required'>Jenis sistem transaksi</Form.Label>
                        <Form.Select value={formData.simulationType}
                            onChange={(e) => { setFormData({ ...formData, simulationType: e.target.value }) }}>
                            <option value="Posted Offer">Posted Offer</option>
                            <option value="Double Auction">Double Auction</option>
                            <option value="Decentralized">Desentralisasi</option>
                        </Form.Select>
                    </Form.Group>

                    <section className="row mb-3">
                        <div className="col-md-6">
                            <Form.Group controlId="goodsType">
                                <Form.Label className='required'>Jenis barang</Form.Label>
                                <Form.Select value={formData.goodsType}
                                    onChange={(e) => { setFormData({ ...formData, goodsType: e.target.value }) }}>
                                    <option value={"Inelastis"}>Inelastis</option>
                                    <option value={"Elastis"}>Elastis</option>
                                </Form.Select>
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group controlId="inflationType">
                                <Form.Label className='required'>Jenis inflasi</Form.Label>
                                <Form.Select value={formData.inflationType}
                                    onChange={(e) => { setFormData({ ...formData, inflationType: e.target.value }) }}>
                                    <option value={"Inflasi Rendah"}>Inflasi Rendah</option>
                                    <option value={"Inflasi Tinggi"}>Inflasi Tinggi</option>
                                </Form.Select>
                            </Form.Group>
                        </div>
                    </section>

                    <section className="row mb-3">
                        <div className="col-md-6">
                            <Form.Group controlId="goodsName">
                                <Form.Label className='required'>Nama barang</Form.Label>
                                <Form.Control type="text" placeholder="contoh: Mobil" required
                                    onChange={(e) => { setFormData({ ...formData, goodsName: e.target.value }) }} />
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group controlId="file" className="mb-3">
                                <Form.Label className='required'>Illustrasi Barang</Form.Label>
                                <Form.Control type="file" accept="image/*" required onChange={fileHandler} />
                            </Form.Group>
                        </div>
                    </section>

                    <section className="row mb-3">
                        <div className="col-md-6">
                            <Form.Group controlId="participantNumber">
                                <Form.Label className='required'>Jumlah responden</Form.Label>
                                <br />
                                <Form.Control type="number" style={{ width: "5em", display: "inline" }}
                                    defaultValue={formData.participantNumber} required
                                    onChange={(e) => { setFormData({ ...formData, participantNumber: e.target.value }) }} />
                                &nbsp;Maka,
                                <span className='fw-bold'> {(togglePlayer) ? Math.floor(formData.participantNumber / 2) + (formData.participantNumber % 2) : Math.floor(formData.participantNumber / 2)} Penjual </span>
                                dan
                                <span className='fw-bold'> {(!togglePlayer) ? Math.floor(formData.participantNumber / 2) + (formData.participantNumber % 2) : Math.floor(formData.participantNumber / 2)} Pembeli </span>
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group controlId="simulationBudget">
                                <Form.Label className='required'>Anggaran Simulasi</Form.Label>
                                <br />
                                <Form.Control
                                    defaultValue={formData.simulationBudget} required
                                    onChange={budgetHandler} />
                            </Form.Group>
                        </div>
                    </section>

                    <section className="row mt-5">
                        <div className="col-md-6">
                            <p className="fw-bold text-center">Unit Cost</p>
                            {Array.from({ length: formData.participantNumber / 2 }).map((_, i) => (
                                <UnitInput
                                    key={i + 1}
                                    id={i + 1}
                                    required
                                    role="penjual"
                                    onChange={(e) => {
                                        const value = numberInputFormat(e, e.target.value)
                                        setUnitCosts({ ...unitCosts, ["penjual" + (i + 1)]: value });
                                    }}
                                />
                            ))}
                            {(formData.participantNumber % 2) ?
                                (togglePlayer ?
                                    <UnitInput
                                        key={formData.participantNumber / 2 + 0.5}
                                        id={formData.participantNumber / 2 + 0.5}
                                        required
                                        role="penjual"
                                        onChange={(e) => { additionalPlayerHandler(e, true) }}
                                    />
                                    :
                                    <div className="d-flex">
                                        <Button className='mx-auto' variant="primary" onClick={togglePlayerHandler}>Lebihkkan penjual</Button>
                                    </div>
                                )
                                :
                                ''
                            }
                        </div>
                        <div className="col-md-6">
                            <p className="fw-bold text-center">Unit Value</p>
                            {Array.from({ length: formData.participantNumber / 2 }).map((_, i) => (
                                <UnitInput
                                    key={i + 1}
                                    id={i + 1}
                                    required
                                    role="pembeli"
                                    onChange={(e) => {
                                        const value = numberInputFormat(e, e.target.value)
                                        setUnitValues({ ...unitValues, ["pembeli" + (i + 1)]: value });
                                    }}
                                />
                            ))}
                            {(formData.participantNumber % 2) ?
                                (!togglePlayer ?
                                    <UnitInput
                                        key={formData.participantNumber / 2 + 0.5}
                                        id={formData.participantNumber / 2 + 0.5}
                                        required
                                        role="pembeli"
                                        onChange={(e) => { additionalPlayerHandler(e, false) }}
                                    />
                                    :
                                    <div className="d-flex">
                                        <Button className='mx-auto' variant="primary" onClick={togglePlayerHandler}>Lebihkkan pembeli</Button>
                                    </div>
                                )
                                :
                                ''
                            }
                        </div>
                    </section>

                    <Button className="my-3 p-3 float-end" variant="primary" type="submit">Submit</Button>
                </form>
            </Container >
        )
    }
}
