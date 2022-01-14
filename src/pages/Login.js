import React, { useEffect, useState } from 'react'
import { Container, Form, Button } from 'react-bootstrap';
import { loginAdmin } from '../utils/Auth';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {
    const [password, setPassword] = useState("");

    useEffect(() => {
        document.title = "Login as Admin";
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        loginAdmin(password, () => {
            window.location.href = "/";
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