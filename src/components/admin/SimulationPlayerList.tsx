import React from "react";
import { css, StyleSheet } from "aphrodite";
import UnitPlayer from "./units/UnitPlayer";

export default function SimulationPlayerList(props: any) {
  const { sellers, buyers } = props;

  const styles = StyleSheet.create({
    section: {
      marginTop: "5rem",
    },
  });

  return (
    <section className={css(styles.section) + " row"}>
      <h1 className="text-center">Peserta</h1>
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
  );
}
