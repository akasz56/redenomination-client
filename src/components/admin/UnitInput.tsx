import { Form } from "react-bootstrap";
import { capitalize } from "../../common/utils/others";

export default function UnitInput(props: any) {
  const disabled = props.disabled !== undefined;
  const required = props.required !== undefined;
  const controlID = props.role + "" + props.id;
  const title = capitalize(props.role) + " " + props.id;
  const classes = "d-flex justify-content-evenly mb-3 " + props.className;

  return (
    <Form.Group controlId={controlID} className={classes}>
      <Form.Label className={required ? "required" : ""}>{title}:</Form.Label>
      <Form.Control
        style={{ width: "11em", display: "inline" }}
        defaultValue={props.defaultValue}
        required={required}
        disabled={disabled}
        onChange={props.onChange}
      />
    </Form.Group>
  );
}
