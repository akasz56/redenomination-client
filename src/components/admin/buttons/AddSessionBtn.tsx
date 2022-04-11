import React from "react";
import { css, StyleSheet } from "aphrodite";
import { Modal, Button, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { createSession } from "../../../common/adapters/session.adapter";

export default function AddSessionBtn(props: any) {
  const { simulationID } = useParams();
  const [showModal, setshowModal] = React.useState<boolean>(false);
  const [formData, setFormData] = React.useState<any>({
    simulationID: simulationID,
    sessionType: "Ulangan Kesekian",
    timer: 1,
  });

  const styles = StyleSheet.create({
    timer: {
      width: "3.8em",
      display: "inline",
    },
  });

  function toggleModal() {
    setshowModal((prev) => !prev);
  }

  async function submitCreateSession(e: React.FormEvent) {
    e.preventDefault();
    toggleModal();

    await createSession(formData).then((res: any) => {
      window.location.href = "/sessions/" + res.data.id;
    });
  }

  return (
    <>
      <Button className="w-100 py-lg-2" onClick={toggleModal}>
        + Tambah ulangan
      </Button>
      <Modal show={showModal} onHide={toggleModal}>
        <form onSubmit={submitCreateSession}>
          <Modal.Header closeButton>
            <Modal.Title>Tambah Ulangan Simulasi</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="sessionType">
              <Form.Label className="required">Nama Sesi</Form.Label>
              <Form.Control
                type="text"
                defaultValue={formData.sessionType}
                required
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormData({ ...formData, sessionType: e.target.value });
                }}
              />
            </Form.Group>
            <Form.Group controlId="timer" className="mt-3">
              <Form.Label className="required">Timer</Form.Label>
              <br />
              <Form.Control
                type="number"
                className={css(styles.timer)}
                required
                min={0}
                step={1}
                defaultValue={formData.timer}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormData({ ...formData, timer: e.target.value });
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
