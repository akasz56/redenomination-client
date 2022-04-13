import React from "react";
import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { startSession } from "../../../common/adapters/session.adapter";

export default function StartSessionBtn(props: any) {
  const { token } = props;
  const { sessionID } = useParams();

  async function submitStartSession(e: React.MouseEvent) {
    e.preventDefault();

    if (window.confirm("Jalankan sesi sekarang?") && sessionID) {
      await startSession(sessionID).then(() => {
        window.location.reload();
      });
    }
  }

  return (
    <>
      <section>
        <hr />
        <div className="text-center mb-3">
          <p>Token Partisipan:</p>
          <p className="fw-bold text-primary fs-3">{token}</p>
        </div>
        <Button className="w-100 p-4" onClick={submitStartSession}>
          Jalankan Ulangan
        </Button>
        <hr />
      </section>
    </>
  );
}
