import { css, StyleSheet } from "aphrodite";
import React from "react";
import { useNavigate } from "react-router-dom";
import { readAllSimulations } from "../../common/adapters/simulation.adapter";
import LoadingScreen from "../LoadingScreen";
import AddSimulationBtn from "./buttons/AddSimulationBtn";

export default function AdminTable(props: any) {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [simulations, setSimulations] = React.useState<Array<any>>([]);
  const navigate = useNavigate();

  const styles = StyleSheet.create({
    simulations: {
      verticalAlign: "middle",
      cursor: "pointer",
    },
    simulationNumber: {
      fontSize: "1.5em",
      textAlign: "center",
    },
    simulationTD: {
      padding: "1.5em 0",
    },
    simulationH3: {
      fontWeight: 700,
    },
  });

  React.useEffect(() => {
    async function fetchData() {
      await readAllSimulations()
        .then((res) => {
          if (res) {
            setSimulations(res);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }

    fetchData();
  });

  function rowHandler(e: React.FormEvent, id: string) {
    e.preventDefault();
    navigate("/simulations/" + id);
  }

  if (loading) {
    return (
      <tr>
        <td colSpan={3}>
          <LoadingScreen className="mx-auto my-5" />
        </td>
      </tr>
    );
  } else {
    if (simulations.length === 0) {
      return (
        <tr>
          <td colSpan={3} className="text-center py-5">
            <h1>No Data</h1>
            <AddSimulationBtn />
          </td>
        </tr>
      );
    } else {
      return (
        <>
          {simulations.map((simulation: any, i: number) => (
            <tr
              key={i}
              className={css(styles.simulations)}
              onClick={(e: React.FormEvent) => rowHandler(e, simulation.id)}
            >
              <td>
                <h3 className={css(styles.simulationH3)}>{simulation.token}</h3>
                <span>
                  {simulation.goodsType} ({simulation.goodsName}){" "}
                  {simulation.inflationType}
                  <br />
                  Pertumbuhan Ekonomi {simulation.growthType}
                </span>
              </td>
              <td>
                {simulation.simulationType}
                <br />
                {simulation.participants.length + " peserta"}
              </td>
            </tr>
          ))}
        </>
      );
    }
  }
}
