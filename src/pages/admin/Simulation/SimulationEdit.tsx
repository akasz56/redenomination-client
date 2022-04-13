import React from "react";
import { Button, Container, Form, Image } from "react-bootstrap";
import { useParams } from "react-router-dom";
import {
  readSimulation,
  updateSimulation,
  uploadPicture,
} from "../../../common/adapters/simulation.adapter";
import { imgURL } from "../../../common/config";
import { priceMask } from "../../../common/utils/others";
import { responseErrorHandler } from "../../../common/utils/responseHandler";
import UnitInput from "../../../components/admin/units/UnitInput";
import LoadingScreen from "../../../components/LoadingScreen";
import Error404 from "../../errors/Error404";

export default function SimulationEdit() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [fileSend, setFileSend] = React.useState<Blob | string>("");
  const [data, setData] = React.useState<any>({});
  const { simulationID } = useParams();

  React.useEffect(() => {
    document.title = "Tidak ada Data";

    async function fetchData(simulationID: string) {
      await readSimulation(simulationID).then((res) => {
        setData(res);
        setLoading(false);
        document.title = "Edit " + simulationID;
      });
    }

    if (simulationID) {
      fetchData(simulationID);
    }
  }, [simulationID]);

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (fileSend !== "") {
      let pic = new FormData();
      pic.append("file", fileSend);
      await uploadPicture(data.id, pic).catch(() => {
        responseErrorHandler("Foto gagal diupload");
      });
    }

    await updateSimulation(data.id, {
      simulationType: data.simulationType,
      goodsType: data.goodsType,
      goodsName: data.goodsName,
      inflationType: data.inflationType,
      growthType: data.growthType,
      simulationBudget: data.simulationBudget,
    })
      .then(() => {
        window.alert("Data berhasil diubah");
        window.location.href = "/simulations/" + data.id;
      })
      .finally(() => {
        setLoading(false);
      });
  }

  if (loading) {
    return <LoadingScreen className="child" />;
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
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e: any) => {
                      e.preventDefault();
                      setFileSend(e.target.files[0]);
                    }}
                  />
                </Form.Group>
              </div>
            </section>

            <section className="row mb-3">
              <div className="col-md-6" />
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
                {data.sellers.map((_: any, i: number) => (
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
                {data.buyers.map((_: any, i: number) => (
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
