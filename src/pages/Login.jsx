import React, { useEffect, useState } from 'react'
import { Container, Form, Button } from 'react-bootstrap';
import { loginAsAdmin } from '../utils/Auth';

export default function Login() {
    const [password, setPassword] = useState("");

    useEffect(() => {
        document.title = "Login as Admin";
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        loginAsAdmin(password, () => {
            window.location.href = "/admin";
        });
    }

    return (
        <Container>
            <Form className="mt-5" onSubmit={handleSubmit}>
                <Form.Group controlId="login">
                    <Form.Label>Masukkan password admin</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                </Form.Group>
                <Button className="mt-3 float-end" variant="primary" type="submit">Submit</Button>
            </Form>
        </Container>
    )
}