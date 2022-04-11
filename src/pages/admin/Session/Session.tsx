import React from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { readSession } from "../../../common/adapters/session.adapter";
import DeleteSessionBtn from "../../../components/admin/buttons/DeleteSessionBtn";
import SessionHeader from "../../../components/admin/SessionHeader";
import SessionStatusView from "../../../components/admin/SessionStatusView";
import SessionTimer from "../../../components/admin/SessionTimer";
import LoadingScreen from "../../../components/LoadingScreen";
import Error404 from "../../errors/Error404";

export default function Session() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [data, setData] = React.useState<any>({});
  const { sessionID } = useParams();

  React.useEffect(() => {
    document.title = "Tidak ada Data";

    async function fetchData(sessionID: string) {
      await readSession(sessionID).then((res: any) => {
        setData(res);
        setLoading(false);
        document.title = "Ulangan " + res.id;
      });
    }

    if (sessionID) {
      fetchData(sessionID);
    }
  }, [sessionID]);

  if (loading) return <LoadingScreen className="child" />;
  else {
    if (data) {
      return (
        <Container>
          <SessionHeader session={data} />
          <SessionTimer duration={data.duration} />
          <SessionStatusView session={data} />
          <DeleteSessionBtn
            simulationID={data.simulation.id}
            sessionName={data.sessionName}
          />
        </Container>
      );
    } else {
      return <Error404 />;
    }
  }
}
