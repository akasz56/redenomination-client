import React from "react";

export default function Label(props) {
  function Element() {
    if (props.complete === "true") {
      return (
        <>
          <p className="fw-bolder">{props.phase}</p>
          <p>Jenis Barang: {props.goods}</p>
          <p>Jenis Inflasi: {props.inflation}</p>
        </>
      );
    } else {
      return (
        <>
          <p>Anda sedang menjalani tipe simulasi {props.type}</p>
          <p className="fw-bolder">Masa {props.phase}</p>
          <p>Jenis Barang: {props.goods}</p>
          <p>Jenis Inflasi: {props.inflation}</p>
        </>
      );
    }
  }

  const elseProps = Object.keys(props)
    .filter(
      (key) =>
        !key.includes("className") &&
        !key.includes("phase") &&
        !key.includes("goods") &&
        !key.includes("inflation")
    )
    .reduce((cur, key) => {
      return Object.assign(cur, { [key]: props[key] });
    }, {});

  return (
    <div className={props.className + " p-3 rounded shadow"} {...elseProps}>
      <Element />
    </div>
  );
}
