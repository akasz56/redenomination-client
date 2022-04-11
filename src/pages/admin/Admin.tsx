import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Table } from "react-bootstrap";
import { css, StyleSheet } from "aphrodite";
import { readAllSimulations } from "../../common/adapters/simulation.adapter";
import AddSimulationBtn from "../../components/admin/buttons/AddSimulationBtn";
import LoadingScreen from "../../components/LoadingScreen";
import { logout } from "../../common/utils/authHandler";

export default function Admin() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [simulations, setSimulations] = React.useState<Array<any>>([]);

  const styles = StyleSheet.create({
    header: {
      position: "relative",
    },
    addBtn: {
      position: "absolute",
      bottom: "15%",
      right: 0,
    },
  });

  React.useEffect(() => {
    document.title = "Halaman Admin";

    async function fetchData() {
      await readAllSimulations()
        .then((res) => {
          setSimulations(res);
        })
        .finally(() => {
          setLoading(false);
        });
    }

    fetchData();
  }, []);

  function logoutBtnHandler(e: React.FormEvent) {
    e.preventDefault();
    if (window.confirm("Yakin ingin keluar?")) {
      logout();
    }
  }

  function TableRow() {
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

    function rowHandler(e: React.FormEvent, id: string) {
      e.preventDefault();
      navigate("/simulations/" + id);
    }

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
          {simulations.map((simulation, i) => (
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

  return (
    <Container>
      <section className={"mt-5 " + css(styles.header)}>
        <span className="fs-1">Daftar Simulasi</span>
        <AddSimulationBtn className={css(styles.addBtn)} />
      </section>

      <Table responsive hover className="mt-3">
        <thead>
          <tr>
            <th>Detail Simulasi</th>
            <th>Jenis Simulasi</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={3}>
                <LoadingScreen className="mx-auto my-5" />
              </td>
            </tr>
          ) : (
            <TableRow />
          )}
        </tbody>
      </Table>

      <section className="d-flex flex-row-reverse">
        <Button variant="danger" onClick={logoutBtnHandler}>
          Log Out
        </Button>
      </section>
    </Container>
  );
}
