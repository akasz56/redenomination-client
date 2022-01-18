import React, { useEffect, useState } from 'react'
import { Container, Form, Button } from 'react-bootstrap';
import { loginParticipant } from '../utils/Auth';
import './Home.css';

export default function Home() {
    const [token, setToken] = useState("");

    useEffect(() => {
        document.title = "Redenomination Project App";
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        loginParticipant(token, () => {
            window.location.href = "/";
        });
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
