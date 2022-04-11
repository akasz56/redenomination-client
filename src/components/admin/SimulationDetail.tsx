import React from "react";
import { css, StyleSheet } from "aphrodite";
import SimulationImage from "./SimulationImage";

export default function SimulationDetail(props: any) {
  const { simulation } = props;

  const styles = StyleSheet.create({
    section: {
      marginTop: "5rem",
    },
  });

  return (
    <section className={css(styles.section)}>
      <h1 className="text-center">Detail Simulasi</h1>
      <hr />
      <div className="row text-center">
        <div className="col-md-6">
          <p>
            Jenis Pertumbuhan Ekonomi :{" "}
            <span className="fw-bold">{simulation.growthType}</span>
          </p>
          <p>
            Jenis Barang :{" "}
            <span className="fw-bold">
              {simulation.goodsType} ({simulation.goodsName})
            </span>
          </p>
        </div>
        <div className="col-md-6">
          <p>
            Anggaran per ulangan :{" "}
            <span className="fw-bold">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(simulation.simulationBudget)}
            </span>
          </p>
          <p>
            Jenis Inflasi :{" "}
            <span className="fw-bold">{simulation.inflationType}</span>
          </p>
        </div>
      </div>
      <SimulationImage url={simulation.goodsPic} label={simulation.goodsType} />
    </section>
  );
}
