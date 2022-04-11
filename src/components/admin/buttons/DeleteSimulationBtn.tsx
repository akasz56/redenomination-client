import React from "react";
import { useParams } from "react-router-dom";
import { css, StyleSheet } from "aphrodite";
import { capitalize } from "../../../common/utils/others";
import { Button, Form, Modal } from "react-bootstrap";
import { deleteSimulation } from "../../../common/adapters/simulation.adapter";

export default function DeleteSimulationBtn(props: any) {
  const simulationType = props.type ? capitalize(props.type) : "simulationType";
  const [showModal, setshowModal] = React.useState<boolean>(false);
  const [keyword, setkeyword] = React.useState<string>("");
  const { simulationID } = useParams();

  const styles = StyleSheet.create({
    section: { marginTop: "5rem" },
  });

  function toggleModal() {
    setshowModal((prev) => !prev);
  }

  async function submitDelete(e: React.FormEvent) {
    e.preventDefault();
    setshowModal((prev) => !prev);
    if (keyword === simulationType && simulationID) {
      await deleteSimulation(simulationID).then(() => {
        window.location.href = "/admin";
      });
    } else {
      alert("Keyword yang dimasukkan salah, Simulasi gagal dihapus");
    }
  }
  return (
    <>
      <section className={css(styles.section) + " mb-5"}>
        <h1 className="text-center">Hapus Simulasi</h1>
        <hr />
        <Button variant="danger" className="mt-3" onClick={toggleModal}>
          Hapus Simulasi
        </Button>
      </section>
      <Modal show={showModal} onHide={toggleModal} centered>
        <form onSubmit={submitDelete}>
          <Modal.Header closeButton>
            <Modal.Title>Konfirmasi Hapus Simulasi</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="confirm">
              <p>
                Aksi ini <strong>tidak dapat dibatalkan</strong>. Ketik ulang
                Tipe Simulasi untuk mengkonfirmasi anda benar-benar ingin
                menghapus.
              </p>
              <Form.Control
                required
                placeholder={simulationType}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setkeyword(e.target.value);
                }}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={toggleModal}>
              Batalkan
            </Button>
            <Button variant="danger" type="submit">
              Konfirmasi Hapus
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
