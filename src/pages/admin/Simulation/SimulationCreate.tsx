import React from "react";
import { Button, Container, Form } from "react-bootstrap";
import {
  createSimulation,
  uploadPicture,
} from "../../../common/adapters/simulation.adapter";
import { inputNumber } from "../../../common/utils/others";
import { responseErrorHandler } from "../../../common/utils/responseHandler";
import UnitInput from "../../../components/admin/UnitInput";
import LoadingScreen from "../../../components/LoadingScreen";

export default function SimulationCreate() {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [fileSend, setFileSend] = React.useState<Blob | string>("");
  const [unitValues, setUnitValues] = React.useState<Array<number>>([]);
  const [unitCosts, setUnitCosts] = React.useState<Array<number>>([]);
  const [participantNumber, setParticipantNumber] = React.useState<number>(20);
  const [formData, setFormData] = React.useState<any>({
    simulationType: "Posted Offer",
    goodsType: "Inelastis",
    goodsName: "",
    inflationType: "Inflasi Rendah",
    growthType: "Tinggi",
    simulationBudget: 200000,
  });

  React.useEffect(() => {
    document.title = "Buat Simulasi baru";
  }, []);

  function budgetHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const value = inputNumber(e, e.target.value);
    setFormData({ ...formData, simulationBudget: value });
  }

  function fileHandler(e: any) {
    e.preventDefault();
    setFileSend(e.target.files[0]);
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();

    const body = {
      ...formData,
      unitCosts: Object.values(unitCosts),
      unitValues: Object.values(unitValues),
    };

    setLoading(true);
    await createSimulation(body)
      .then(async (res: any) => {
        await submitPic(res.id);
        window.location.href = "/simulations/" + res.id;
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function submitPic(id: string) {
    let pic = new FormData();
    pic.append("file", fileSend);
    await uploadPicture(id, pic).catch((err) => {
      responseErrorHandler("Foto gagal diupload");
    });
  }

  if (loading) return <LoadingScreen className="child" />;
  else {
    return (
      <Container>
        <form onSubmit={submitForm}>
          <h1 className="mt-5">Simulasi Baru</h1>

          <section className="row">
            <div className="col-md-6">
              <Form.Group controlId="type" className="mb-3">
                <Form.Label className="required">
                  Jenis sistem transaksi
                </Form.Label>
                <Form.Select
                  value={formData.simulationType}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setFormData({
                      ...formData,
                      simulationType: e.target.value,
                    });
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
                  value={formData.growthType}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setFormData({ ...formData, growthType: e.target.value });
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
                  value={formData.goodsType}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setFormData({ ...formData, goodsType: e.target.value });
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
                  value={formData.inflationType}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setFormData({ ...formData, inflationType: e.target.value });
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
                  placeholder="contoh: Mobil"
                  required
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData({ ...formData, goodsName: e.target.value });
                  }}
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group controlId="file" className="mb-3">
                <Form.Label className="required">Illustrasi Barang</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  required
                  onChange={fileHandler}
                />
              </Form.Group>
            </div>
          </section>

          <section className="row mb-3">
            <div className="col-md-6">
              <Form.Group controlId="participantNumber">
                <Form.Label className="required">Jumlah partisipan</Form.Label>
                <br />
                <Form.Control
                  type="number"
                  style={{ width: "5em", display: "inline" }}
                  defaultValue={participantNumber}
                  required
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setParticipantNumber(parseInt(e.target.value));
                  }}
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group controlId="simulationBudget">
                <Form.Label className="required">Anggaran Simulasi</Form.Label>
                <br />
                <Form.Control
                  defaultValue={formData.simulationBudget}
                  required
                  onChange={budgetHandler}
                />
              </Form.Group>
            </div>
          </section>

          <section className="row mt-5">
            <div className="col-md-6">
              <p className="fw-bold text-center">Unit Cost</p>
              {Array.from({ length: participantNumber / 2 }).map((_, i) => (
                <UnitInput
                  key={i + 1}
                  id={i + 1}
                  required
                  role="penjual"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = inputNumber(e, e.target.value);
                    setUnitCosts({
                      ...unitCosts,
                      [i + 1]: value,
                    });
                  }}
                />
              ))}
            </div>
            <div className="col-md-6">
              <p className="fw-bold text-center">Unit Value</p>
              {Array.from({ length: participantNumber / 2 }).map((_, i) => (
                <UnitInput
                  key={i + 1}
                  id={i + 1}
                  required
                  role="pembeli"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = inputNumber(e, e.target.value);
                    setUnitValues({
                      ...unitValues,
                      [i + 1]: value,
                    });
                  }}
                />
              ))}
            </div>
          </section>

          <Button
            className="my-3 p-3 float-end"
            variant="primary"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Container>
    );
  }
}
