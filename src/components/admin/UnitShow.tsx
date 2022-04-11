import { css, StyleSheet } from "aphrodite";
import { Form } from "react-bootstrap";

export default function UnitShow(props: any) {
  const { defaultValue } = props;

  const styles = StyleSheet.create({
    unitShow: { width: "11em", display: "inline" },
  });

  return (
    <Form.Group className={"d-flex justify-content-evenly"}>
      <Form.Control
        disabled
        defaultValue={defaultValue}
        className={css(styles.unitShow) + " d-block mb-3"}
        {...props}
      />
    </Form.Group>
  );
}
