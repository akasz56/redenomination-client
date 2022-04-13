import React from "react";
import { css, StyleSheet } from "aphrodite";
import UnitPlayer from "./units/UnitPlayer";

export default function SimulationPlayerList(props: any) {
  const { participants } = props;

  const styles = StyleSheet.create({
    section: {
      marginTop: "5rem",
    },
  });

  return (
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
  );
}
