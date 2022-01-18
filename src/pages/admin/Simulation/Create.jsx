import React, { useEffect, useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { createSimulation } from '../../../adapters/Simulations';
import UnitInput from '../../../components/UnitInput';

export default function Create() {
    const [unitValues, setUnitValues] = useState({});
    const [unitCosts, setUnitCosts] = useState({});
    const [formData, setFormData] = useState({
        simulationType: "Posted Offer",
        goodsType: "Non-Elastis",
        goodsName: '',
        goodsPic: '',
        inflationType: "Inflasi Rendah",
        participantNumber: 20,
        timer: 2,
    });

    useEffect(() => {
        document.title = "Create new Simulation";
    })

    function submitForm(e) {
        e.preventDefault();
        const res = createSimulation({ ...formData, unitCost: unitValues, unitValue: unitCosts });
        if (res.status === 200) {
            console.log(res);
        } else {
            console.log(res);
        }
        // window.location.href = "/admin";
    }

    return (
        <Container>
            <form onSubmit={submitForm}>
                <h1 className='mt-5'>Simulasi Baru</h1>

                <Form.Group controlId='type' className="mb-3">
                    <Form.Label className='required'>Jenis sistem transaksi</Form.Label>
                    <Form.Select
                        value={formData.simulationType}
                        onChange={(e) => { setFormData({ ...formData, simulationType: e.target.value }) }}>
                        <option value="Posted Offer">Posted Offer</option>
                        <option value="Double Action">Double Auction</option>
                        <option value="Desentralisasi">Desentralisasi</option>
                    </Form.Select>
                </Form.Group>

                <section className="row mb-3">
                    <div className="col-md-6">
                        <Form.Group controlId="">
                            <Form.Label className='required'>Jenis barang</Form.Label>
                            <Form.Select
                                value={formData.goodsType}
                                onChange={(e) => { setFormData({ ...formData, goodsType: e.target.value }) }}>
                                <option value={"Non-Elastis"}>Non-Elastis</option>
                                <option value={"Elastis"}>Elastis</option>
                            </Form.Select>
                        </Form.Group>
                    </div>
                    <div className="col-md-6">
                        <Form.Group controlId="">
                            <Form.Label className='required'>Jenis inflasi</Form.Label>
                            <Form.Select
                                value={formData.inflationType}
                                onChange={(e) => { setFormData({ ...formData, inflationType: e.target.value }) }}>
                                <option value={"Inflasi Rendah"}>Inflasi Rendah</option>
                                <option value={"Inflasi Tinggi"}>Inflasi Tinggi</option>
                            </Form.Select>
                        </Form.Group>
                    </div>
                </section>

                <section className="row mb-3">
                    <div className="col-md-6">
                        <Form.Group controlId="">
                            <Form.Label>Nama barang</Form.Label>
                            <Form.Control type="text" placeholder="contoh: Mobil"
                                onChange={(e) => { setFormData({ ...formData, goodsName: e.target.value }) }} />
                        </Form.Group>
                    </div>
                    <div className="col-md-6">
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Illustrasi Barang</Form.Label>
                            <Form.Control type="file" accept="image/*"
                                onChange={(e) => { setFormData({ ...formData, goodsPic: e.target.value }) }} />
                        </Form.Group>
                    </div>
                </section>

                <section className="row mb-3">
                    <div className="col-md-6">
                        <Form.Group controlId="">
                            <Form.Label className='required'>Jumlah participant</Form.Label>
                            <br />
                            <Form.Control type="number" max={100} min={2} step={2} style={{ width: "5em", display: "inline" }}
                                defaultValue={formData.participantNumber}
                                onChange={(e) => { setFormData({ ...formData, participantNumber: e.target.value }) }} />
                            {formData.participantNumber % 2 === 0 ?
                                <>
                                    &nbsp;Maka, <span className='fw-bold'>{formData.participantNumber / 2} Penjual</span> dan <span className='fw-bold'>{formData.participantNumber / 2} Pembeli</span>
                                </>
                                :
                                <span style={{ color: "red", fontWeight: "bold" }}>
                                    &nbsp;Jumlah participant Ganjil!
                                </span>
                            }
                        </Form.Group>
                    </div>
                    <div className="col-md-6">
                        <Form.Group controlId="">
                            <Form.Label className='required'>Timer</Form.Label>
                            <br />
                            <Form.Control type="number" style={{ width: "3.8em", display: "inline" }}
                                defaultValue={formData.timer}
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
                                role="penjual"
                                required
                                onChange={(e) => {
                                    setUnitValues({ ...unitValues, ["penjual" + (i + 1)]: e.target.value });
                                }} />
                        ))}
                    </div>
                    <div className="col-md-6">
                        <p className="fw-bold text-center">Unit Value</p>
                        {Array.from({ length: formData.participantNumber / 2 }).map((_, i) => (
                            <UnitInput
                                key={i + 1}
                                id={i + 1}
                                role="pembeli"
                                required
                                onChange={(e) => {
                                    setUnitCosts({ ...unitCosts, ["pembeli" + (i + 1)]: e.target.value });
                                }} />
                        ))}
                    </div>
                </section>

                <Button className="my-3 p-3 float-end" variant="primary" type="submit">Buat Simulasi Baru</Button>
            </form>
        </Container >
    )
}
