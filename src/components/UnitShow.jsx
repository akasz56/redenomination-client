import { capitalize } from '../Utils';

export default function UnitShow(props) {

    const title = capitalize(props.role) + " " + props.id
    const classes = "d-flex justify-content-center mb-3" + props.className;

    return (
        <div className={classes}>
            <p>{title}: Rp. {props.price}</p>
        </div >
    )
}