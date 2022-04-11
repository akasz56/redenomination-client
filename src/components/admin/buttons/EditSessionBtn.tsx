import React from "react";
import { useParams } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";
import { updateSession } from "../../../common/adapters/session.adapter";

export default function EditSessionBtn(props: any) {
  const { session } = props;
  const [showModal, setshowModal] = React.useState<boolean>(false);
  const [dataPost, setDataPost] = React.useState<any>({});
  const { sessionID } = useParams();

  React.useEffect(() => {
    setDataPost({
      sessionName: session.sessionName,
      duration: session.duration,
    });
  }, [session]);

  function toggleModal() {
    setshowModal((prev) => !prev);
  }

  async function submitEdit(e: React.FormEvent) {
    e.preventDefault();
    setshowModal((prev) => !prev);
    if (sessionID) {
      await updateSession(sessionID, dataPost).then(() => {
        alert("Ulangan berhasil diubah");
        window.location.reload();
      });
    } else {
      alert("Ulangan gagal dihapus");
    }
  }
  return (
    <>
      <Button variant="outline-dark" className="py-1" onClick={toggleModal}>
        edit
      </Button>
      <Modal show={showModal} onHide={toggleModal}>
        <form onSubmit={submitEdit}>
          <Modal.Header closeButton>
            <Modal.Title>Tambah Ulangan Simulasi</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="sessionType">
              <Form.Label className="required">Nama Sesi</Form.Label>
              <Form.Control
                type="text"
                defaultValue={dataPost.sessionType}
                required
                onChange={(e) => {
                  setDataPost({ ...dataPost, sessionType: e.target.value });
                }}
              />
            </Form.Group>
            <Form.Group controlId="timer" className="mt-3">
              <Form.Label className="required">Timer</Form.Label>
              <br />
              <Form.Control
                type="number"
                style={{ width: "3.8em", display: "inline" }}
                required
                defaultValue={dataPost.timer}
                onChange={(e) => {
                  setDataPost({ ...dataPost, timer: e.target.value });
                }}
              />
              &nbsp;Menit
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={toggleModal}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
