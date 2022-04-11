import React from "react";

export default function SessionTimer(props: any) {
  const { duration } = props;

  return (
    <section className="mt-4 text-center">
      <p>
        Timer : <span className="fw-bold">{duration} menit</span>
      </p>
    </section>
  );
}
