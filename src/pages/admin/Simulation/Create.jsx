import { useEffect, useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { createSimulation, uploadPicture } from '../../../adapters/Simulations';
import UnitInput from '../../../components/UnitInput';

export default function Create() {
    const [unitValues, setUnitValues] = useState({});
    const [unitCosts, setUnitCosts] = useState({});
    const [formData, setFormData] = useState({
        simulationType: "Posted Offer",
        goodsType: "Non-Elastis",
        goodsName: '',
        inflationType: "Inflasi Rendah",
        participantNumber: 20,
        timer: 1,
    });

    useEffect(() => {
        document.title = "Buat Simulasi baru";
    })

    async function submitForm(e) {
        e.preventDefault();

        if (formData.participantNumber % 2) {
            alert("Jumlah responden tidak bisa ganjil atau kosong");
            document.getElementById('participantNumber').scrollIntoView();
            return;
        }

        const res = await createSimulation({ ...formData, unitCost: unitValues, unitValue: unitCosts });
        if (res.status === 201) {
            const fileName = await uploadPic(res.data.id);
            if (fileName !== null) {
                window.location.href = '/admin';
            }
        } else if (res.status === 401) {
            console.log(res);
            window.alert("Tidak diizinkan mengakses");
        } else {
            console.log(res);
            alert("Terjadi Kesalahan, mohon coba lagi")
        }
    }

    async function uploadPic(id) {
        const input = document.querySelector('input[type="file"]')
        let pic = new FormData()
        pic.append('file', input.files[0])
        const res = await uploadPicture(id, pic);
        if (res.status === 200) {
            return res.data.goodsPic;
        } else {
            console.log(res);
            alert("Terjadi Kesalahan dalam mengupload foto");
            return null;
        }
    }

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
                                <option value={"Non-Elastis"}>Non-Elastis</option>
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
                            <Form.Label>Illustrasi Barang</Form.Label>
                            <Form.Control type="file" accept="image/*" />
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
                            {formData.participantNumber % 2 === 0 ?
                                <>
                                    &nbsp;Maka, <span className='fw-bold'>{formData.participantNumber / 2} Penjual</span> dan <span className='fw-bold'>{formData.participantNumber / 2} Pembeli</span>
                                </>
                                :
                                <span style={{ color: "red", fontWeight: "bold" }}>&nbsp;Jumlah responden ganjil!</span>
                            }
                        </Form.Group>
                    </div>
                    <div className="col-md-6">
                        <Form.Group controlId="timer">
                            <Form.Label className='required'>Timer</Form.Label>
                            <br />
                            <Form.Control type="number" style={{ width: "3.8em", display: "inline" }}
                                defaultValue={formData.timer} required
                                onChange={(e) => { setFormData({ ...formData, timer: e.target.value }) }} />
                            &nbsp;Menit
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
                                onChange={(e) => { setUnitValues({ ...unitValues, ["penjual" + (i + 1)]: e.target.value }); }}
                            />
                        ))}
                    </div>
                    <div className="col-md-6">
                        <p className="fw-bold text-center">Unit Value</p>
                        {Array.from({ length: formData.participantNumber / 2 }).map((_, i) => (
                            <UnitInput
                                key={i + 1}
                                id={i + 1}
                                required
                                role="pembeli"
                                onChange={(e) => { setUnitCosts({ ...unitCosts, ["pembeli" + (i + 1)]: e.target.value }); }}
                            />
                        ))}
                    </div>
                </section>

                <Button className="my-3 p-3 float-end" variant="primary" type="submit">Submit</Button>
            </form>
        </Container >
    )
}
