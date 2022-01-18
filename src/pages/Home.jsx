import { useEffect, useState } from 'react'
import { Container, Form, Button } from 'react-bootstrap';
import { myRole } from '../Utils';
import { connectAsParticipant } from "../adapters/Authentication";
import './Home.css';

export default function Home() {
    const [token, setToken] = useState("");

    useEffect(() => {
        document.title = "Redenomination Project App";
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();

        if (myRole()) {
            alert(`Anda sudah login sebagai ${myRole()}`)
            window.location.href = "/";
        }

        const res = await connectAsParticipant(token);
        if (res.status === 200) {
            localStorage.setItem('auth', JSON.stringify({
                login: true,
                role: "participant",
                token: "Bearer yes"
                // token: "Bearer " + res.data.jwtToken
            }));
            window.location.href = "/";
        } else if (res.status === 401) {
            alert("Token tidak valid");
            setToken("");
        } else {
            console.log(res);
            alert("Terdapat kesalahan");
        }
    }

    return (
        <Container>
            <h1 className="mt-5 title">Selamat Datang!</h1>
            <Form className="mt-3" onSubmit={handleSubmit}>
                <Form.Group controlId="login">
                    <Form.Label>Masukkan token partisipan anda disini</Form.Label>
                    <Form.Control type="text" placeholder="Token" autoComplete="off" value={token} onChange={e => setToken(e.target.value)} />
                </Form.Group>
                <Button className="mt-3 float-end" variant="primary" type="submit">Submit</Button>
            </Form>
        </Container >
    )
}
