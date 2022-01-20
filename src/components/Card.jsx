import { Button } from 'react-bootstrap';
import './Card.css';

export default function Card(props) {
    let variant;
    switch (props.variant) {
        case 'wait':
            variant = <p className="var text-danger">Belum Terjual</p>
            break;
        case 'done':
            variant = <p className="var text-primary">Terjual</p>
            break;
        case 'decentralized':
            variant = <Button className="var" onClick={props.onBtnClick} >Tanya Penjual</Button>
            break;
        default:
            variant = <Button className="var" onClick={props.onBtnClick}>Beli</Button>
            break;
    }

    const role = props.role ? props.role : "Title 0";

    const elseProps = Object.keys(props).filter((key) => (
        !key.includes('onBtnClick') &&
        !key.includes('variant') &&
        !key.includes('role') &&
        !key.includes('className') &&
        !key.includes('children')))
        .reduce((cur, key) => { return Object.assign(cur, { [key]: props[key] }) }, {});

    return (
        <div className={"simulation-card " + props.className} {...elseProps}>
            <span className="fw-bold">{role}</span>
            <span className="price">
                {props.children}
            </span>
            {variant}
        </div>
    )
}
