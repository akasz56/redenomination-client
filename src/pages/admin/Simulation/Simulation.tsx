import React from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { readSimulation } from "../../../common/adapters/simulation.adapter";
import DeleteSimulationBtn from "../../../components/admin/buttons/DeleteSimulationBtn";
import SimulationDetail from "../../../components/admin/SimulationDetail";
import SimulationHeader from "../../../components/admin/SimulationHeader";
import SimulationTable from "../../../components/admin/SimulationTable";
import SimulationUnitCostValueList from "../../../components/admin/SimulationUnitCostValueList";
import LoadingScreen from "../../../components/LoadingScreen";
import Error404 from "../../errors/Error404";

export default function Simulation() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [simulation, setSimulation] = React.useState<any>({});
  const { simulationID } = useParams();

  React.useEffect(() => {
    document.title = "Tidak ada Data";

    async function fetchData(simulationID: string) {
      await readSimulation(simulationID)
        .then((res: any) => {
          setSimulation(res);
          document.title = "Simulasi " + simulationID;
        })
        .finally(() => {
          setLoading(false);
        });
    }

    if (simulationID) {
      fetchData(simulationID);
    }
  }, [simulationID]);

  if (loading) return <LoadingScreen className="child" />;
  else {
    if (simulation) {
      return (
        <Container>
          <SimulationHeader
            type={simulation.simulationType}
            token={simulation.token}
            time={simulation.timeCreated}
          />
          <SimulationTable sessions={simulation.sessions} />
          {/* <SimulationSummary /> */}
          <SimulationUnitCostValueList
            sellers={simulation.sellers}
            buyers={simulation.buyers}
          />
          <SimulationDetail simulation={simulation} />
          <DeleteSimulationBtn type={simulation.simulationType} />
        </Container>
      );
    } else {
      return <Error404 />;
    }
  }
}
