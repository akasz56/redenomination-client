import React from "react";
import { css, StyleSheet } from "aphrodite";
import { capitalize } from "../../../common/utils/others";
import { Button, Form, Modal } from "react-bootstrap";

export default function DeleteSimulationBtn(props: any) {
  const simulationType = props.type ? capitalize(props.type) : "simulationType";
  const [showModal, setshowModal] = React.useState(false);
  // const { simulationID } = useParams();

  const styles = StyleSheet.create({
    section: { marginTop: "5rem" },
  });

  function toggleModal() {
    setshowModal((prev) => !prev);
  }

  async function submitDelete(e: any) {
    e.preventDefault();
    setshowModal((prev) => !prev);
    alert("yes");
    // if (e.target.elements.confirm.value === simulationType) {
    //   await deleteSimulation(simulationID)
    //   .then()
    //   if (res.status === 200) {
    //     window.location.href = "/admin";
    //   } else if (res.status === 401) {
    //     printLog(res);
    //     window.alert("Tidak diizinkan mengakses");
    //     setLoading(false);
    //   } else {
    //     printLog(res);
    //     alert("Terjadi Kesalahan, mohon coba lagi");
    //     setLoading(false);
    //   }
    // } else {
    //   alert("Simulasi gagal dihapus");
    // }
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
                name="confirm"
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
