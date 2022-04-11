import React from "react";
import { Link, useParams } from "react-router-dom";
import { finishSession } from "../../../common/adapters/session.adapter";
import UnitPlayer from "../units/UnitPlayer";

export default function StopSessionBtn(props: any) {
  const { token, sellers, buyers } = props;
  const { sessionID } = useParams();

  // React.useEffect(() => {
  //   socket.emit("adminLoginToken", { token: data.simulation.token });

  //   function activePlayersListener(res) {
  //     setParticipant({
  //       sellers: res.sellers,
  //       buyers: res.buyers,
  //     });
  //   }
  //   socket.on("admin:activePlayers", activePlayersListener);

  //   function isSessionDoneListener(res) {
  //     window.location.reload();
  //   }
  //   socket.on("admin:isSessionDone", isSessionDoneListener);

  //   return () => {
  //     socket.off("admin:activePlayers", activePlayersListener);
  //     socket.off("admin:isSessionDone", isSessionDoneListener);
  //   };
  // }, []);

  async function stopSession(e: React.MouseEvent) {
    if (window.confirm("Yakin ingin menghentikan sesi?") && sessionID) {
      await finishSession(sessionID).then(() => {
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
        <Link to="#" className="btn btn-danger w-100 p-4" onClick={stopSession}>
          Hentikan Ulangan
        </Link>
        <hr />
      </section>

      <section style={{ marginTop: "5rem" }} className="row">
        <h1>Peserta</h1>
        <hr />
        <div className="col-md-6">
          <p className="fw-bold text-center">Daftar Penjual</p>
          {sellers.map((item: any, i: number) => (
            <UnitPlayer key={i + 1} id={i + 1} role="penjual" item={item} />
          ))}
        </div>
        <div className="col-md-6">
          <p className="fw-bold text-center">Daftar Pembeli</p>
          {buyers.map((item: any, i: number) => (
            <UnitPlayer key={i + 1} id={i + 1} role="pembeli" item={item} />
          ))}
        </div>
      </section>
    </>
  );
}
