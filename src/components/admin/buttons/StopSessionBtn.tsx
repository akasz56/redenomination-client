import React from "react";
import { css, StyleSheet } from "aphrodite";
import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { stopSession } from "../../../common/adapters/session.adapter";
import { readSimulationByToken } from "../../../common/adapters/simulation.adapter";
import UnitPlayer from "../units/UnitPlayer";

export default function StopSessionBtn(props: any) {
  const { token } = props;
  const { sessionID } = useParams();
  const [participants, setParticipants] = React.useState<Array<any>>([]);

  const styles = StyleSheet.create({
    section: {
      marginTop: "5rem",
    },
  });

  React.useEffect(() => {
    async function fetchData(token: string) {
      await readSimulationByToken(token).then((res) => {
        setParticipants(res.participants);
      });
    }

    if (token) {
      fetchData(token);
    }
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
  }, [token]);

  async function submitStopSession(e: React.MouseEvent) {
    e.preventDefault();

    if (window.confirm("Yakin ingin menghentikan sesi?") && sessionID) {
      await stopSession(sessionID).then(() => {
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
        <Button
          variant="danger"
          className="w-100 p-4"
          onClick={submitStopSession}
        >
          Hentikan Ulangan
        </Button>
        <hr />
      </section>

      <section className={css(styles.section) + " row"}>
        <h1 className="text-center">Status Peserta</h1>
        <hr />
        <div className="col-md-6">
          {participants
            .slice(0, participants.length / 2)
            .map((item: any, i: number) => (
              <UnitPlayer key={i + 1} item={item} />
            ))}
        </div>
        <div className="col-md-6">
          {participants
            .slice(participants.length / 2)
            .map((item: any, i: number) => (
              <UnitPlayer key={i + 1} item={item} />
            ))}
        </div>
      </section>
    </>
  );
}
