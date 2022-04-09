import { StyleSheet, css } from "aphrodite";
import React from "react";

export default function Footer() {
  const styles = StyleSheet.create({
    footer: {
      marginTop: "auto",
      width: "100vw",
    },
  });

  return (
    <footer className={css(styles.footer)}>
      <hr />
      <p className="text-center text-muted fw-bold">© 2022 Codepanda.id</p>
    </footer>
  );
}
