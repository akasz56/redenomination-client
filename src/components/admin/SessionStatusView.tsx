import React from "react";
import StartSessionBtn from "./buttons/StartSessionBtn";
import StopSessionBtn from "./buttons/StopSessionBtn";

export default function SessionStatusView(props: any) {
  const { isRunning, isFinished } = props.session;
  const { token, sellers, buyers } = props.session.simulation;

  if (isFinished) {
    return <h1>QWEASDZXC</h1>;
    // return <SessionSummary session={session} />;
  } else {
    if (isRunning) {
      return <StopSessionBtn token={token} sellers={sellers} buyers={buyers} />;
    } else {
      return <StartSessionBtn token={token} />;
    }
  }
}
