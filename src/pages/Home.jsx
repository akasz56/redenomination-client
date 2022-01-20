import { useEffect, useState } from 'react'
import { Container, Form, Button } from 'react-bootstrap';
import { connectAsParticipant } from "../adapters/Authentication";
import LoadingComponent from '../components/Loading';
import { myRole } from '../Utils';
import './Home.css';

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState("");

    useEffect(() => {
        document.title = "Redenomination Project App";
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();

        if (myRole()) {
            alert(`Anda sudah login sebagai ${myRole()}`)
            window.location.href = "/";
        }

        setLoading(true)
        const res = await connectAsParticipant(token);
        if (res.status === 200) {
            localStorage.setItem('auth', JSON.stringify({
                login: true,
                role: "participant",
                token: "Bearer " + res.data.jwtToken
            }));
            window.location.href = "/";
        } else if (res.status === 401) {
            setLoading(false)
            setToken("");
            alert("Token tidak valid");
        } else {
            setLoading(false)
            console.log(res);
            alert("Terdapat kesalahan");
        }
    }

    if (loading) { return <LoadingComponent className='child' /> }
    else
        return (
            <Container>
                <h1 className="mt-5 title">Selamat Datang!</h1>
                <Form className="mt-3" onSubmit={handleSubmit}>
                    <Form.Group controlId="login">
                        <Form.Label>Masukkan token partisipan anda disini</Form.Label>
                        <Form.Control type="text" placeholder="Token" autoComplete="off" value={token} onChange={e => setToken(e.target.value)} />
                    </Form.Group>
                    <Button className="mt-3 float-end" variant="primary" type="submit">Masuk</Button>
                </Form>
            </Container >
        )
}
