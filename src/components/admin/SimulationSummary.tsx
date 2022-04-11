import { StyleSheet } from "aphrodite";
import React from "react";
import { useParams } from "react-router-dom";
import { generateRandomHexColor } from "../../common/utils/others";

export default function SimulationSummary() {
  const [dataSummary, setDataSummary] = React.useState<any>({});
  const { simulationID } = useParams();

  const styles = StyleSheet.create({
    header: {
      position: "relative",
    },
  });

  React.useEffect(() => {
    async function fetchSummary() {
      //   await readSimulationSummary(simulationID).then((res: any) => {
      //     const labels = [
      //       "Pre-Redenominasi",
      //       "Transisi Redenominasi",
      //       "Pasca Redenominasi",
      //     ];
      //     setDataSummary({
      //       price: {
      //         labels,
      //         datasets: res.sessionSummary.map((session: any, idx: number) => {
      //           const randomColor = generateRandomHexColor();
      //           return {
      //             label: "Ulangan " + (idx + 1),
      //             data: session.phaseSummary.map(
      //               (phase: any) => phase.avgTrxPrice
      //             ),
      //             borderColor: randomColor,
      //             backgroundColor: randomColor,
      //           };
      //         }),
      //       },
      //       trx: {
      //         labels,
      //         datasets: res.sessionSummary.map((session: any, idx: number) => {
      //           const randomColor = generateRandomHexColor();
      //           return {
      //             label: "Ulangan " + (idx + 1),
      //             data: session.phaseSummary.map(
      //               (phase: any) => phase.avgTrxOccurrence
      //             ),
      //             borderColor: randomColor,
      //             backgroundColor: randomColor,
      //           };
      //         }),
      //       },
      //     });
      //   });
    }

    fetchSummary();
  }, [simulationID]);

  return (
    <>
      {/* {dataSummary ? (
        <>
          <UnitProfit
            profits={sessionProfitsToArray(simulation.sessions)}
            budget={simulation.simulationBudget * simulation.sessions.length}
          />

          <section style={{ marginTop: "5rem" }} className="row">
            <h1 className="text-center">Ringkasan Simulasi</h1>
            <hr />
            <div className="col-md-6">
              <Line
                data={dataSummary.trx}
                width={"100px"}
                height={"50px"}
                ref={trxOccurrence}
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: "Jumlah Transaksi",
                    },
                  },
                }}
              />
              <div className="d-flex justify-content-around">
                <Button
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    downloadPNG(
                      trxOccurrence,
                      "Jumlah Transaksi " + simulation.token
                    );
                  }}
                >
                  <i className="bx bx-download"></i> Download PNG
                </Button>
                <CSVLink
                  className="btn btn-primary"
                  filename={"Jumlah Transaksi " + simulation.token}
                  data={[
                    ["Ulangan"].concat(dataSummary.trx.labels),
                    ...dataSummary.trx.datasets.map((dataset) => [
                      dataset.label,
                      ...dataset.data,
                    ]),
                  ]}
                >
                  <i className="bx bx-download"></i> Download CSV
                </CSVLink>
              </div>
            </div>
            <div className="col-md-6">
              <Line
                data={dataSummary.price}
                width={"100px"}
                height={"50px"}
                ref={trxPrice}
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: "Rata-rata Harga kesepakatan",
                    },
                  },
                }}
              />
              <div className="d-flex justify-content-around">
                <Button
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    downloadPNG(
                      trxPrice,
                      "Rata-rata Harga Kesepakatan Transaksi " +
                        simulation.token
                    );
                  }}
                >
                  <i className="bx bx-download"></i> Download PNG
                </Button>
                <CSVLink
                  className="btn btn-primary"
                  filename={
                    "Rata-rata Harga Kesepakatan Transaksi " + simulation.token
                  }
                  data={[
                    ["Ulangan"].concat(dataSummary.price.labels),
                    ...dataSummary.price.datasets.map((dataset) => [
                      dataset.label,
                      ...dataset.data,
                    ]),
                  ]}
                >
                  <i className="bx bx-download"></i> Download CSV
                </CSVLink>
              </div>
            </div>
          </section>
        </>
      ) : (
        <></>
      )} */}
    </>
  );
}
