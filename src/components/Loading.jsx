import ReactLoading from 'react-loading';

export default function LoadingComponent(props) {
    return (
        <ReactLoading type="spin" color="#000" className={props.className} height={"5em"} width={"5em"} />
    )
}