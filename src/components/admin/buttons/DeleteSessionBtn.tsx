import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { deleteSession } from "../../../common/adapters/session.adapter";
import { capitalize } from "../../../common/utils/others";

export default function DeleteSessionBtn(props: any) {
  const { simulationID } = props;
  const sessionName = props.sessionName
    ? capitalize(props.sessionName)
    : "sessionName";
  const [showModal, setshowModal] = React.useState<boolean>(false);
  const [keyword, setkeyword] = React.useState<string>("");
  const { sessionID } = useParams();

  function toggleModal() {
    setshowModal((prev) => !prev);
  }

  async function submitDelete(e: React.FormEvent) {
    e.preventDefault();
    setshowModal((prev) => !prev);

    if (keyword === sessionName && sessionID) {
      await deleteSession(sessionID).then(() => {
        window.location.href = "/simulations/" + simulationID;
      });
    } else {
      alert("Keyword yang dimasukkan salah, Ulangan gagal dihapus");
    }
  }

  return (
    <>
      <section className="my-5">
        <h1>Hapus Ulangan</h1>
        <Button variant="danger" onClick={toggleModal}>
          Hapus Ulangan
        </Button>
      </section>

      <Modal show={showModal} onHide={toggleModal} centered>
        <form onSubmit={submitDelete}>
          <Modal.Header closeButton>
            <Modal.Title>Konfirmasi Hapus Ulangan</Modal.Title>
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
                placeholder={sessionName}
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
