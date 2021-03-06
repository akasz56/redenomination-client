import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Form, Button, Image } from "react-bootstrap";
import {
  readSimulation,
  updateSimulation,
  uploadPicture,
} from "../../../adapters/Simulations";
import LoadingComponent from "../../../components/Loading";
import UnitInput from "../../../components/UnitInput";
import Error404 from "../../errors/Error404";
import { imgURL } from "../../../adapters/serverURL";
import { priceMask, printLog } from "../../../Utils";

export default function Edit() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const urlParams = useParams();

  useEffect(() => {
    document.title = "Tidak ada Data";

    async function fetchData() {
      const res = await readSimulation(urlParams.id);
      if (res.status === 200) {
        setData(res.data);
        setLoading(false);
        document.title = "Edit " + res.data.id;
      } else if (res.status === 401) {
        setLoading(false);
        printLog(res);
        window.alert("Tidak diizinkan mengakses");
      } else if (res.status === 404) {
        window.alert("Simulasi tidak ditemukan");
        window.location.href = "/admin";
      } else {
        setLoading(false);
        printLog(res);
        alert("Terjadi Kesalahan");
      }
    }
    fetchData();
  }, [urlParams.id]);

  async function submitForm(e) {
    e.preventDefault();
    setLoading(true);

    const fileName = await uploadPic();
    const res = await updateSimulation(data.id, {
      simulationType: data.simulationType,
      goodsType: data.goodsType,
      goodsName: data.goodsName,
      goodsPic: fileName ? fileName : data.goodsPic,
      inflationType: data.inflationType,
      participantNumber: data.participantNumber,
      simulationBudget: data.simulationBudget,
    });
    if (res.status === 200) {
      window.alert("Data berhasil diubah");
      window.location.href = "/simulations/" + data.id;
    } else if (res.status === 401) {
      printLog(res);
      window.alert("Tidak diizinkan mengakses");
    } else if (res.status === 404) {
      window.alert("Simulasi tidak ditemukan");
      window.location.href = "/admin";
    } else {
      printLog(res);
      alert("Terjadi Kesalahan");
    }
    setLoading(false);
  }

  async function uploadPic() {
    const input = document.querySelector('input[type="file"]');
    if (input.files.length > 0) {
      let pic = new FormData();
      pic.append("file", input.files[0]);
      const res = await uploadPicture(data.id, pic);
      if (res.status === 201) {
        return res.data.goodsPic;
      } else {
        printLog(res);
        alert("Terjadi Kesalahan dalam mengupload foto");
      }
    }
    return null;
  }

  if (loading) {
    return <LoadingComponent className="child" />;
  } else {
    if (data) {
      return (
        <Container>
          <form onSubmit={submitForm}>
            <h1 className="mt-5">Ubah Simulasi</h1>

            <section className="row">
              <div className="col-md-6">
                <Form.Group controlId="type" className="mb-3">
                  <Form.Label className="required">
                    Jenis sistem transaksi
                  </Form.Label>
                  <Form.Select
                    value={data.simulationType}
                    onChange={(e) => {
                      setData({ ...data, simulationType: e.target.value });
                    }}
                  >
                    <option value="Posted Offer">Posted Offer</option>
                    <option value="Double Auction">Double Auction</option>
                    <option value="Decentralized">Desentralisasi</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="growthType">
                  <Form.Label className="required">
                    Jenis Pertumbuhan Ekonomi
                  </Form.Label>
                  <Form.Select
                    value={data.growthType}
                    onChange={(e) => {
                      setData({ ...data, growthType: e.target.value });
                    }}
                  >
                    <option value={"Tinggi"}>Tinggi</option>
                    <option value={"Rendah"}>Rendah</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </section>

            <section className="row mb-3">
              <div className="col-md-6">
                <Form.Group controlId="goodsType">
                  <Form.Label className="required">Jenis barang</Form.Label>
                  <Form.Select
                    value={data.goodsType}
                    onChange={(e) => {
                      setData({ ...data, goodsType: e.target.value });
                    }}
                  >
                    <option value={"Inelastis"}>Inelastis</option>
                    <option value={"Elastis"}>Elastis</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="inflationType">
                  <Form.Label className="required">Jenis inflasi</Form.Label>
                  <Form.Select
                    value={data.inflationType}
                    onChange={(e) => {
                      setData({ ...data, inflationType: e.target.value });
                    }}
                  >
                    <option value={"Inflasi Rendah"}>Inflasi Rendah</option>
                    <option value={"Inflasi Tinggi"}>Inflasi Tinggi</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </section>

            <section className="row mb-3">
              <div className="col-md-6">
                <Form.Group controlId="goodsName">
                  <Form.Label className="required">Nama barang</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={data.goodsName}
                    required
                    onChange={(e) => {
                      setData({ ...data, goodsName: e.target.value });
                    }}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="file" className="mb-3">
                  <Form.Label className="required">
                    Illustrasi Barang
                  </Form.Label>
                  <Image
                    src={imgURL + data.goodsPic}
                    className=" w-100 mb-3"
                    thumbnail
                    rounded
                  ></Image>
                  <Form.Control type="file" accept="image/*" />
                </Form.Group>
              </div>
            </section>

            <section className="row mb-3">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="d-block">Jumlah responden</Form.Label>
                  <Form.Control
                    type="number"
                    style={{ width: "5em", display: "inline" }}
                    disabled
                    value={data.participantNumber}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="simulationBudget">
                  <Form.Label className="required">
                    Anggaran Simulasi
                  </Form.Label>
                  <br />
                  <Form.Control
                    defaultValue={priceMask(data.simulationBudget)}
                    required
                    disabled
                  />
                </Form.Group>
              </div>
            </section>

            <section className="row mt-5">
              <div className="col-md-6">
                <p className="fw-bold text-center">Unit Cost</p>
                {data.sellers.map((_, i) => (
                  <UnitInput
                    disabled
                    key={i + 1}
                    id={i + 1}
                    role="penjual"
                    defaultValue={parseInt(data.sellers[i].unitCost)}
                  />
                ))}
              </div>
              <div className="col-md-6">
                <p className="fw-bold text-center">Unit Value</p>
                {data.buyers.map((_, i) => (
                  <UnitInput
                    disabled
                    key={i + 1}
                    id={i + 1}
                    role="pembeli"
                    defaultValue={parseInt(data.buyers[i].unitValue)}
                  />
                ))}
              </div>
            </section>

            <Button className="my-3 p-3 float-end" type="submit">
              Simpan
            </Button>
          </form>
        </Container>
      );
    } else {
      return <Error404 />;
    }
  }
}
