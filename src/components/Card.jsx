import { Button } from 'react-bootstrap';
import './Card.css';

export default function Card(props) {

    let element = <Button className="var">Beli</Button>
    if (props.variant === 'done') {
        element = <p className="var text-primary">Terjual</p>
    } else if (props.variant === 'waiting') {
        element = <p className="var text-danger">Belum Terjual</p>
    }

    return (
        <div className={"simulation-card " + props.className}>
            <span className="fw-bold">Penjual 1</span>
            <span className="price">Rp. 3700</span>
            {element}
        </div>
    )
}
