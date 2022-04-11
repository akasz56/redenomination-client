import React from "react";
import { Link, useParams } from "react-router-dom";
import { runSession } from "../../../common/adapters/session.adapter";

export default function StartSessionBtn(props: any) {
  const { token } = props;
  const { sessionID } = useParams();

  async function startSession(e: React.MouseEvent) {
    e.preventDefault();

    if (window.confirm("Jalankan sesi sekarang?") && sessionID) {
      await runSession(sessionID);
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
        <Link
          to="#"
          className="btn btn-primary w-100 p-4"
          onClick={startSession}
        >
          Jalankan Ulangan
        </Link>
        <hr />
      </section>
    </>
  );
}
