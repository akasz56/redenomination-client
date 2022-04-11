import { Form } from "react-bootstrap";
import { css, StyleSheet } from "aphrodite";
import { capitalize } from "../../common/utils/others";

export default function UnitInput(props: any) {
  const { disabled, required, role, id, className } = props;

  const controlID = role + "" + id;
  const title = capitalize(role) + " " + id;
  const classes = "d-flex justify-content-center mb-3 " + className;

  const styles = StyleSheet.create({
    unitInput: { width: "15em", display: "inline", marginLeft: "2em" },
  });

  return (
    <Form.Group controlId={controlID} className={classes}>
      <Form.Label className={required ? "required" : ""}>{title}:</Form.Label>
      <Form.Control
        required={required}
        disabled={disabled}
        className={css(styles.unitInput)}
        defaultValue={props.defaultValue}
        onChange={props.onChange}
      />
    </Form.Group>
  );
}
