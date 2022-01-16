import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { createSimulation } from '../../../adapters/Simulations';

export default function Create() {
    const [unitValues, setUnitValues] = useState({});
    const [unitCosts, setUnitCosts] = useState({});
    const [formData, setFormData] = useState({
        simulationType: "Posted Offer",
        goodsType: "Non-Elastis (Beras)",
        goodsName: '',
        goodsPic: '',
        inflationType: "Inflasi Rendah",
        participantNumber: 20,
        timer: 2,
    });

    function submitForm(e) {
        e.preventDefault();
        createSimulation({ ...formData, buyer: unitValues, seller: unitCosts });
    }

    return (
        <Container>
            <h1 className='mt-5'>Simulasi Baru</h1>

            <Form.Group controlId='type' className="mb-3">
                <Form.Label className='required'>Jenis sistem transaksi</Form.Label>
                <Form.Select
                    value={formData.simulationType}
                    onChange={(e) => { setFormData({ ...formData, simulationType: e.target.value }) }}>
                    <option value="Posted Offer">Posted Offer</option>
                    <option value="Double Auction">Double Auction</option>
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
                            <option value={"Non-Elastis (Beras)"}>Non-Elastis (Beras)</option>
                            <option value={"Elastis (Mobil)"}>Elastis (Mobil)</option>
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
                        <Form.Label>Jumlah participant</Form.Label>
                        <br />
                        <Form.Control type="number" style={{ width: "5em", display: "inline" }}
                            defaultValue={formData.participantNumber}
                            onChange={(e) => { setFormData({ ...formData, participantNumber: e.target.value }) }} />
                        {formData.participantNumber % 2 == 0 ?
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
                        <Form.Label>Timer</Form.Label>
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
                        <Form.Group key={i + 1} controlId={"penjual " + (i + 1)} className="d-flex justify-content-evenly mb-3">
                            <Form.Label>Penjual {i + 1}:</Form.Label>
                            <Form.Control type="number" style={{ width: "6em", display: "inline" }}
                                onChange={(e) => { setUnitValues({ ...unitValues, ["unitValue"]: e.target.value }) }} />
                        </Form.Group>
                    ))}
                </div>
                <div className="col-md-6">
                    <p className="fw-bold text-center">Unit Value</p>
                    {Array.from({ length: formData.participantNumber / 2 }).map((_, i) => (
                        <Form.Group key={i + 1} controlId={"pembeli " + (i + 1)} className="d-flex justify-content-evenly mb-3">
                            <Form.Label>Pembeli {i + 1}:</Form.Label>
                            <Form.Control type="number" style={{ width: "6em", display: "inline" }}
                                onChange={(e) => { setUnitCosts({ ...unitCosts, ["unitCost"]: e.target.value }) }} />
                        </Form.Group>
                    ))}
                </div>
            </section>

            <Button className="my-3 p-3 float-end" variant="primary" type="submit" onClick={submitForm}>Buat Simulasi Baru</Button>
        </Container >
    )
}
