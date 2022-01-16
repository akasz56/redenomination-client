import { Image } from 'react-bootstrap'

export default function Summary(props) {
    return (
        <div className='mt-4 d-flex flex-column'>
            <span className='text-center fs-4'>{props.title}</span>
            <Image className='mx-auto' src={props.src} fluid></Image>
            <a className='text-end' href={props.download}>download rincian...</a>
        </div>
    )
}
