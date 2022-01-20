import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Form, Button, Image } from 'react-bootstrap';
import { readSimulation, updateSimulation } from '../../../adapters/Simulations';
import LoadingComponent from '../../../components/Loading';
import UnitInput from '../../../components/UnitInput';
import Error404 from '../../errors/Error404';

export default function Edit() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const urlParams = useParams();

    useEffect(() => {
        document.title = "Tidak ada Data";

        async function fetchData() {
            const res = await readSimulation(urlParams.id)
            if (res.status === 200) {
                setData(res.data);
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

    // function changeValue(value, key, key2) {
    //     setData({
    //         ...data,
    //         [key]: Object.assign([], data[key], { 0: { ...data[key][0], [key2]: value } })
    //     })
    // }

    async function submitForm(e) {
        e.preventDefault();
        const res = await updateSimulation(data.id, {
            simulationType: data.simulationType,
            goodsType: data.goodsType,
            goodsName: data.goodsName,
            goodsPic: data.goodsPic,
            inflationType: data.inflationType,
            participantNumber: data.participantNumber,
            timer: data.timer
        });
        if (res.status === 200) {
            window.alert("Berhasil diubah");
            window.location.href = "/simulations/" + data.id;
        } else if (res.status === 401) {
            console.log(res);
            window.alert("Tidak diizinkan mengakses");
        } else if (res.status === 404) {
            window.alert("Simulasi tidak ditemukan");
            window.location.href = "/admin";
        } else {
            console.log(res);
            alert("Terjadi Kesalahan");
        }
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
                                <Form.Group controlId="goodsType">
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
                                <Form.Group controlId="inflationType">
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
                                <Form.Group controlId="goodsName">
                                    <Form.Label className='required'>Nama barang</Form.Label>
                                    <Form.Control type="text" defaultValue={data.goodsName} required
                                        onChange={(e) => { setData({ ...data, goodsName: e.target.value }) }} />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group controlId="formFile" className="mb-3">
                                    <Form.Label className='required'>Illustrasi Barang</Form.Label>
                                    <Image src={data.goodsPic} className=' w-100 mb-3' thumbnail rounded ></Image>
                                    <Form.Control type="file" accept="image/*"
                                        onChange={(e) => { setData({ ...data, goodsPic: e.target.value }) }} />
                                </Form.Group>
                            </div>
                        </section>

                        <section className="row mb-3">
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label className="d-block">Jumlah responden</Form.Label>
                                    <Form.Control type="number" style={{ width: "5em", display: "inline" }}
                                        disabled value={data.participantNumber}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group controlId="timer">
                                    <Form.Label className="required d-block">Timer</Form.Label>
                                    <Form.Control type="number" style={{ width: "3.8em", display: "inline" }}
                                        defaultValue={data.timer} required
                                        onChange={(e) => { setData({ ...data, timer: e.target.value }) }} />
                                    &nbsp;Menit
                                </Form.Group>
                            </div>
                        </section>

                        <section className="row mt-5">
                            <div className="col-md-6">
                                <p className="fw-bold text-center">Unit Cost</p>
                                {Array.from({ length: data.participantNumber / 2 }).map((_, i) => (
                                    <UnitInput
                                        disabled
                                        key={i + 1}
                                        id={i + 1}
                                        role="penjual"
                                        defaultValue={data.sellers[i].unitCost}
                                    // onChange={(e) => { changeValue(e.target.value, "sellers", "unitCost") }}
                                    />
                                ))}
                            </div>
                            <div className="col-md-6">
                                <p className="fw-bold text-center">Unit Value</p>
                                {Array.from({ length: data.participantNumber / 2 }).map((_, i) => (
                                    <UnitInput
                                        disabled
                                        key={i + 1}
                                        id={i + 1}
                                        role="pembeli"
                                        defaultValue={data.buyers[i].unitValue}
                                    // onChange={(e) => { changeValue(e.target.value, "buyers", "unitValue") }}
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
