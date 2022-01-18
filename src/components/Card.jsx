import { Button } from 'react-bootstrap';
import './Card.css';

export default function Card(props) {

    let variant = <Button className="var">Beli</Button>
    if (props.variant === 'wait') { variant = <p className="var text-danger">Belum Terjual</p> }
    else if (props.variant === 'done') { variant = <p className="var text-primary">Terjual</p> }
    else if (props.variant === 'decentralized') { variant = <Button className="var">Tanya Penjual</Button> }

    const role = props.role ? props.role : "Title 0";

    return (
        <div className={"simulation-card " + props.className}>
            <span className="fw-bold">{role}</span>
            <span className="price">
                {props.children}
            </span>
            {variant}
        </div>
    )
}
