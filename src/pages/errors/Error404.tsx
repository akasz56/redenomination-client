import { css, StyleSheet } from "aphrodite";

export default function Error404() {
  const styles = StyleSheet.create({
    parent: {
      position: "relative",
      height: "85vh",
    },

    child: {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      fontSize: "2em",
    },
    title: {
      fontSize: "2.5em",
    },
  });

  return (
    <section className={css(styles.parent)}>
      <div className={css(styles.child)}>
        <h1 className={css(styles.title)}>404</h1>
        <p>Tidak ditemukan</p>
      </div>
    </section>
  );
}
