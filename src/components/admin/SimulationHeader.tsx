import React from "react";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { css, StyleSheet } from "aphrodite";
import { Link } from "react-router-dom";
import { capitalize } from "../../common/utils/others";

export default function SimulationHeader(props: any) {
  const simulationType = props.type ? capitalize(props.type) : "No Data";
  const token = props.token ?? "No Data";
  const timeCreated = props.time
    ? dayjs(props.time).locale("id").format("dddd, D MMM YYYY")
    : "Invalid Date";

  const styles = StyleSheet.create({
    header: {
      position: "relative",
    },
  });

  return (
    <section className={css(styles.header) + " mt-5 row"}>
      <div className="col-6">
        <h1>{simulationType}</h1>
        <p>
          Token Partisipan:{" "}
          <span className="fw-bold text-primary">{token}</span>
        </p>
      </div>
      <div className="col-6 text-end">
        <div>{timeCreated}</div>
        <Link to="./edit" className="btn btn-outline-dark py-1">
          Edit
        </Link>
      </div>
    </section>
  );
}
