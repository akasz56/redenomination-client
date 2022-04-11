import React from "react";
import { Image } from "react-bootstrap";
import { css, StyleSheet } from "aphrodite";
import { imgURL } from "../../common/config";

export default function SimulationImage(props: any) {
  const { url, label } = props;

  const styles = StyleSheet.create({
    image: {
      height: "360px",
    },
  });

  if (url) {
    return (
      <figure className="d-flex flex-column">
        <div className="mx-auto">
          <Image
            className={css(styles.image)}
            src={imgURL + url}
            fluid
            alt={label}
          />
          <p>Illustrasi barang</p>
        </div>
      </figure>
    );
  } else {
    return <></>;
  }
}
