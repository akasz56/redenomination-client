import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Form, Button, Image } from 'react-bootstrap';
import { readSimulation } from '../../../adapters/Simulations';
import LoadingComponent from '../../../components/Loading';
import UnitInput from '../../../components/UnitInput';
import Error404 from '../../errors/Error404';

export default function Edit() {
    const [loading, setLoading] = useState(true);
    const [buyers, setBuyers] = useState(null);
    const [sellers, setSellers] = useState(null);
    const [data, setData] = useState(null);
    const urlParams = useParams();

    useEffect(() => {
        document.title = "Tidak ada Data";

        async function fetchData() {
            const res = await readSimulation(urlParams.id)
            if (res.status === 200) {
                setData(res.data);
                setBuyers(res.data.buyers);
                setSellers(res.data.sellers);
                setLoading(false);
                document.title = "Edit " + res.data.id;
            } else if (res.status === 401) {
                setLoading(false);
                console.log(res);
                window.alert("Tidak diizinkan mengakses");
            } else if (res.status === 404) {
                window.alert("Simulasi tidak ditemukan");
                window.location.href = "/admin";
            } else {
                setLoading(false);
                console.log(res);
                alert("Terjadi Kesalahan");
            }
        }
        fetchData();
    }, [urlParams.id]);

    function changeValue(value, key, key2) {
        setData({
            ...data,
            [key]: Object.assign([], data[key], { 0: { ...data[key][0], [key2]: value } })
        })
    }

    function submitForm(e) {
        e.preventDefault();
    }

    if (loading) { return (<LoadingComponent className='child' />) }
    else {
        if (data) {
            return (
                <Container>
                    <form onSubmit={submitForm}>
                        <h1 className='mt-5'>Ubah Simulasi</h1>

                        <Form.Group controlId='type' className="mb-3">
                            <Form.Label className='required'>Jenis sistem transaksi</Form.Label>
                            <Form.Select
                                value={data.simulationType}
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
                                        value={data.goodsType}
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
                                        value={data.inflationType}
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
                                        defaultValue={data.goodsName}
                                        onChange={(e) => { setData({ ...data, goodsName: e.target.value }) }}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group controlId="formFile" className="mb-3">
                                    <Form.Label>Illustrasi Barang</Form.Label>
                                    <Image src={data.goodsPic} className=' w-100 mb-3' thumbnail rounded ></Image>
                                    <Form.Control type="file" accept="image/*"
                                        onChange={(e) => { setData({ ...data, goodsPic: e.target.value }) }}
                                    />
                                </Form.Group>
                            </div>
                        </section>

                        <section className="row mb-3">
                            <div className="col-md-6">
                                <Form.Group controlId="">
                                    <Form.Label className="required">Jumlah responden</Form.Label>
                                    <br />
                                    <Form.Control type="number" max={100} min={2} step={2} style={{ width: "5em", display: "inline" }}
                                        required
                                        defaultValue={data.participantNumber}
                                        onChange={(e) => { setData({ ...data, participantNumber: e.target.value }) }}
                                    />
                                    {data.participantNumber % 2 === 0 ?
                                        <>
                                            &nbsp;Maka, <span className='fw-bold'>{data.participantNumber / 2} Penjual</span> dan <span className='fw-bold'>{data.participantNumber / 2} Pembeli</span>
                                        </>
                                        :
                                        <span style={{ color: "red", fontWeight: "bold" }}>&nbsp;Jumlah responden ganjil!</span>
                                    }
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group controlId="">
                                    <Form.Label className="required">Timer</Form.Label>
                                    <br />
                                    <Form.Control type="number" style={{ width: "3.8em", display: "inline" }}
                                        required
                                        defaultValue={data.timer}
                                        onChange={(e) => { setData({ ...data, timer: e.target.value }) }}
                                    />
                                    &nbsp;Menit
                                </Form.Group>
                            </div>
                        </section>

                        <section className="row mt-5">
                            <div className="col-md-6">
                                <p className="fw-bold text-center">Unit Cost</p>
                                {Array.from({ length: data.participantNumber / 2 }).map((_, i) => (
                                    <UnitInput
                                        required
                                        key={i + 1}
                                        id={i + 1}
                                        role="penjual"
                                        defaultValue={data.sellers[i].unitCost}
                                        onChange={(e) => { changeValue(e.target.value, "sellers", "unitCost") }}
                                    />
                                ))}
                            </div>
                            <div className="col-md-6">
                                <p className="fw-bold text-center">Unit Value</p>
                                {Array.from({ length: data.participantNumber / 2 }).map((_, i) => (
                                    <UnitInput
                                        required
                                        key={i + 1}
                                        id={i + 1}
                                        role="pembeli"
                                        defaultValue={data.buyers[i].unitValue}
                                        onChange={(e) => { changeValue(e.target.value, "buyers", "unitValue") }}
                                    />
                                ))}
                            </div>
                        </section>

                        <Button className="my-3 p-3 float-end" type="submit">Simpan</Button>
                    </form>
                </Container>
            )
        }
        else { return <Error404 /> }
    }
}
