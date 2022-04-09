import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Table } from "react-bootstrap";
import { css, StyleSheet } from "aphrodite";

export default function Admin() {
  const [loading, setLoading] = React.useState(true);
  const [simulations, setSimulations] = React.useState(null);
  const [noData, setNoData] = React.useState(true);
  const [summary, setSummary] = React.useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    document.title = "Halaman Admin";

    async function fetchData() {
      console.log();
    }
    async function fetchAnova() {}

    fetchData();
    fetchAnova();
  }, []);

  // React.useEffect(() => {
  //   if (simulations) {
  //     if (simulations.length !== 0) {
  //       setNoData(false);
  //     }
  //   }
  // }, [simulations]);

  async function clearBtn(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    // purgeShortlived();
    setLoading(false);
  }

  function addBtnHandler(e: React.FormEvent) {
    e.preventDefault();
    navigate("/simulations/create");
  }

  function rowHandler(e: React.FormEvent, id) {
    e.preventDefault();
    navigate("/simulations/" + id);
  }

  function logoutBtnHandler(e: React.FormEvent) {
    e.preventDefault();
    if (window.confirm("Yakin ingin keluar?")) {
      logout((window.location.href = "/"));
    }
  }

  return (
    <Container>
      <section className="mt-5 header">
        <span className="fs-1">Daftar Simulasi</span>
        <Button variant="primary" onClick={addBtnHandler}>
          Tambah Simulasi
        </Button>
      </section>

      {summary ? (
        <>
          <CSVLink
            filename={
              "Output Struktur Data hasil eksperimen " +
              dayjs().locale("id").format("dddd, D MMM YYYY")
            }
            data={summary}
            className="btn btn-primary"
          >
            <i className="bx bx-download"></i> Download Struktur Data hasil
            eksperimen
          </CSVLink>
          <Button variant="danger" className="d-block mt-3" onClick={clearBtn}>
            <i className="bx bx-trash"></i> Bersihkan Data cache
          </Button>
        </>
      ) : (
        <></>
      )}

      <Table responsive hover className="mt-3">
        <thead>
          <tr>
            <th width="50">No</th>
            <th width="60%">Jenis Simulasi</th>
            <th>Tanggal Dibuat</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={3}>
                <LoadingComponent className="mx-auto my-5" />
              </td>
            </tr>
          ) : noData ? (
            <tr>
              <td colSpan={3} className="text-center py-5">
                <h1>No Data</h1>
                <Button variant="primary" onClick={addBtnHandler}>
                  Tambah Simulasi
                </Button>
              </td>
            </tr>
          ) : (
            simulations.map((simulation, i) => (
              <tr
                key={i}
                className="simulations"
                onClick={(e: React.FormEvent) => rowHandler(e: React.FormEvent, simulation.id)}
              >
                <td className="number">{i + 1}</td>
                <td>
                  <h3>
                    {capitalize(simulation.simulationType)},{" "}
                    {simulation.participantNumber} peserta
                  </h3>
                  <span>
                    {simulation.goodsType} ({simulation.goodsName}),{" "}
                    {simulation.inflationType}, Pertumbuhan Ekonomi{" "}
                    {simulation.growthType}
                  </span>
                </td>
                <td>
                  {dayjs(simulation.timeCreated)
                    .locale("id")
                    .format("dddd, D MMM YYYY")}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <section className="d-flex flex-row-reverse">
        <Button variant="danger" className="" onClick={logoutBtnHandler}>
          Log Out
        </Button>
      </section>
    </Container>
  );
}

// .header {
//   position: relative;
// }

// .header button {
//   position: absolute;
//   bottom: 15%;
//   right: 0;
// }

// .simulations {
//   vertical-align: middle;
//   cursor: pointer;
// }

// .simulations .number {
//   font-size: 1.5em;
//   text-align: center;
// }

// .simulations td {
//   padding: 1.5em 0;
// }

// .simulations h3 {
//   font-weight: 700;
// }