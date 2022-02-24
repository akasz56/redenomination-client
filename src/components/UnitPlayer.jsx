import { useEffect, useRef, useState } from 'react';
import { Form, Overlay, Tooltip } from 'react-bootstrap';

export default function UnitPlayer(props) {
    const [show, setShow] = useState(false);
    const target = useRef(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShow(false)
        }, 2000);

        return () => {
            clearTimeout(timeout)
        }
    }, [show])

    const item = props.item
    const classes = " d-flex justify-content-center" + (props.className ? ' ' + props.className : '');
    const onClickHandler = (e) => {
        setShow(!show)
        navigator.clipboard.writeText(item.username)
    };

    return (
        <Form.Group className={classes}>

            <div ref={target} onClick={onClickHandler}>
                <Form.Control disabled className='text-center'
                    style={{ width: "8em" }}
                    defaultValue={item.username}
                />
            </div>

            <div>
                {item.isLoggedIn ?
                    (item.isReady ?
                        <i className='ms-2 bx bx-md bx-check-circle text-success' />
                        :
                        <i className='ms-2 bx bx-md bx-error-circle text-warning' />
                    )
                    :
                    <i className='ms-2 bx bx-md bx-loader-circle text-primary' />
                }
            </div>

            <Overlay target={target.current} show={show} placement="top">
                {(props) => (
                    <Tooltip {...props}>
                        Tersalin ke clipboard
                    </Tooltip>
                )}
            </Overlay>
        </Form.Group >
    )
}
