import { useEffect, useState } from 'react';
import { Container, Form, Button, Image } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { readSimulation, readUnitCostValue } from '../../../adapters/Simulations';
import UnitInput from '../../../components/UnitInput';

export default function Edit() {
    const [loading, setLoading] = useState(true);
    const [unitValues, setUnitValues] = useState(null);
    const [unitCosts, setUnitCosts] = useState(null);
    const [data, setData] = useState(null);
    const urlParams = useParams();


    useEffect(() => {
        document.title = "No Data";
        readSimulation(urlParams.id).then((value) => {
            setData(value.data);
            document.title = "Edit " + value.data.id;
            readUnitCostValue(urlParams.id).then((value) => {
                setUnitValues(value.unitValue);
                setUnitCosts(value.unitCost);
                setLoading(false);
            })
        })
    }, [urlParams.id]);

    function submitForm(e) {
        e.preventDefault();
    }

    return (
        <Container>
            <form onSubmit={submitForm}>
                <h1 className='mt-5'>Ubah Simulasi</h1>

                <Form.Group controlId='type' className="mb-3">
                    <Form.Label className='required'>Jenis sistem transaksi</Form.Label>
                    <Form.Select
                        value={loading ? "" : data.simulationType}
                        onChange={(e) => { setData({ ...data, simulationType: e.target.value }) }}>
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
                                value={loading ? "" : data.goodsType}
                                onChange={(e) => { setData({ ...data, goodsType: e.target.value }) }}>
                                <option value={"Non-Elastis"}>Non-Elastis</option>
                                <option value={"Elastis"}>Elastis</option>
                            </Form.Select>
                        </Form.Group>
                    </div>
                    <div className="col-md-6">
                        <Form.Group controlId="">
                            <Form.Label className='required'>Jenis inflasi</Form.Label>
                            <Form.Select
                                value={loading ? "" : data.inflationType}
                                onChange={(e) => { setData({ ...data, inflationType: e.target.value }) }}>
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
                            <Form.Control type="text"
                                defaultValue={loading ? "" : data.goodsName}
                                onChange={(e) => { setData({ ...data, goodsName: e.target.value }) }}
                            />
                        </Form.Group>
                    </div>
                    <div className="col-md-6">
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Illustrasi Barang</Form.Label>
                            <Image src={loading ? "" : data.goodsPic} className=' w-100 mb-3' thumbnail rounded ></Image>
                            <Form.Control type="file" accept="image/*"
                                onChange={(e) => { setData({ ...data, goodsPic: e.target.value }) }}
                            />
                        </Form.Group>
                    </div>
                </section>

                <section className="row mb-3">
                    <div className="col-md-6">
                        <Form.Group controlId="">
                            <Form.Label className="required">Jumlah participant</Form.Label>
                            <br />
                            <Form.Control type="number" max={100} min={2} step={2} style={{ width: "5em", display: "inline" }}
                                required
                                defaultValue={loading ? "" : data.participantNumber}
                                onChange={(e) => { setData({ ...data, participantNumber: e.target.value }) }}
                            />
                            {loading ? '' :
                                data.participantNumber % 2 === 0 ?
                                    <>
                                        &nbsp;Maka, <span className='fw-bold'>{data.participantNumber / 2} Penjual</span> dan <span className='fw-bold'>{data.participantNumber / 2} Pembeli</span>
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
                            <Form.Label className="required">Timer</Form.Label>
                            <br />
                            <Form.Control type="number" style={{ width: "3.8em", display: "inline" }}
                                required
                                defaultValue={loading ? "" : data.timer}
                                onChange={(e) => { setData({ ...data, timer: e.target.value }) }}
                            />
                            &nbsp;Menit
                        </Form.Group>
                    </div>
                </section>

                <section className="row mt-5">
                    <div className="col-md-6">
                        <p className="fw-bold text-center">Unit Cost</p>
                        {loading ? ''
                            :
                            Array.from({ length: data.participantNumber / 2 }).map((_, i) => (
                                <UnitInput
                                    required
                                    key={i + 1}
                                    id={i + 1}
                                    role="penjual"
                                    defaultValue={unitCosts["penjual" + (i + 1)]}
                                    onChange={(e) => {
                                        setUnitCosts({ ...unitCosts, ["penjual" + (i + 1)]: e.target.value });
                                    }} />
                            ))}
                    </div>
                    <div className="col-md-6">
                        <p className="fw-bold text-center">Unit Value</p>
                        {loading ? ''
                            :
                            Array.from({ length: data.participantNumber / 2 }).map((_, i) => (
                                <UnitInput
                                    required
                                    key={i + 1}
                                    id={i + 1}
                                    role="pembeli"
                                    defaultValue={unitValues["pembeli" + (i + 1)]}
                                    onChange={(e) => {
                                        setUnitValues({ ...unitValues, ["pembeli" + (i + 1)]: e.target.value });
                                    }} />
                            ))}
                    </div>
                </section>

                <Button className="my-3 p-3 float-end" type="submit">Ubah Simulasi</Button>
            </form>
        </Container >
    )
}
