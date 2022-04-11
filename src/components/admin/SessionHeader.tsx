import React from "react";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Link } from "react-router-dom";
import EditSessionBtn from "./buttons/EditSessionBtn";

export default function SessionHeader(props: any) {
  const { session } = props;
  const { sessionType, simulationID, timeCreated } = session;

  const dateCreated = timeCreated
    ? dayjs(timeCreated).locale("id").format("dddd, D MMM YYYY")
    : "Invalid Date";

  return (
    <section className="header mt-5 row">
      <div className="col-9">
        <h1>{sessionType}</h1>
        <Link className="btn btn-primary" to={"/simulations/" + simulationID}>
          {" < "}Kembali
        </Link>
      </div>
      <div className="col-3 text-end">
        <div>{dateCreated}</div>
        <EditSessionBtn session={session} />
      </div>
    </section>
  );
}
