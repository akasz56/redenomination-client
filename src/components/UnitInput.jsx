import { Form } from 'react-bootstrap';
import { capitalize } from '../Utils';

export default function UnitInput(props) {

    const required = props.required !== undefined
    const controlID = props.role + "" + props.id
    const title = capitalize(props.role) + " " + props.id
    const classes = "d-flex justify-content-evenly mb-3 " + props.className;

    return (
        <Form.Group controlId={controlID} className={classes}>
            <Form.Label className={required ? "required" : ''}>{title}:</Form.Label>
            <Form.Control
                type="number"
                style={{ width: "6em", display: "inline" }}
                defaultValue={props.defaultValue}
                required={required}
                onChange={props.onChange} />
        </Form.Group >
    )
}