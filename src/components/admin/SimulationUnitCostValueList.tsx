import React from "react";
import { css, StyleSheet } from "aphrodite";
import UnitShow from "./UnitShow";
import { displayPrice } from "../../common/utils/others";

export default function SimulationUnitCostValueList(props: any) {
  const { sellers, buyers } = props;

  const styles = StyleSheet.create({
    section: { marginTop: "5rem" },
  });

  return (
    <section className={css(styles.section) + " row"}>
      <h1 className="text-center">Unit Cost dan Unit Value</h1>
      <hr />
      <div className="col-md-6">
        <p className="fw-bold text-center">Unit Cost</p>
        {sellers.map((_: any, i: number) => (
          <UnitShow
            key={i + 1}
            defaultValue={displayPrice(sellers[i].unitCost)}
          />
        ))}
      </div>
      <div className="col-md-6">
        <p className="fw-bold text-center">Unit Value</p>
        {buyers.map((_: any, i: number) => (
          <UnitShow
            key={i + 1}
            defaultValue={displayPrice(buyers[i].unitValue)}
          />
        ))}
      </div>
    </section>
  );
}
