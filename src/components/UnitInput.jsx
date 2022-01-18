import { Form } from 'react-bootstrap';

export default function UnitInput(props) {
    const controlID = props.role + "" + props.id
    const title = capitalize(props.role) + " " + props.id
    return (
        <Form.Group controlId={controlID} className="d-flex justify-content-evenly mb-3" >
            <Form.Label>{title}:</Form.Label>
            <Form.Control
                type="number"
                style={{ width: "6em", display: "inline" }}
                defaultValue={props.defaultValue}
                onChange={props.onChange} />
        </Form.Group>
    )
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}