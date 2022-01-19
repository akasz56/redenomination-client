import { Image } from 'react-bootstrap'

export default function Summary({ title, src, download }) {
    return (
        <div className='mt-4 d-flex flex-column'>
            <span className='text-center fs-4'>{title}</span>
            <Image className='mx-auto' src={src} fluid></Image>
            <a className='text-end' href={download}>download rincian...</a>
        </div>
    )
}
