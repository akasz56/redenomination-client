import React, { useEffect, useState } from 'react'
import { Container, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {
    const [name, setName] = useState("");

    useEffect(() => {
        document.title = "Login as Admin";
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (localStorage.getItem('login')) {
            console.log("Fetching Data...")
            fetchData()
        }
        else {
            console.log("Logging in...")
            fetchLogin();
        }
    }

    const fetchData = async () => {
        const login = JSON.parse(localStorage.getItem('login'));
        await fetch('http://127.0.0.1:8000/auth', {
            headers: {
                Authorization: login.token
            }
        })
            .then(response => response.json())
            .then(json => console.log(json));
    }

    const fetchLogin = async () => {
        await fetch('http://127.0.0.1:8000/auth/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: "johndoe",
                password: "password"
            })
        })
            .then(response => response.json())
            .then(json => {
                localStorage.setItem('login', JSON.stringify({
                    login: true,
                    token: "Bearer " + json.access
                }));
            });
    }

    return (
        <Container>
            <Form className="mt-5" onSubmit={handleSubmit}>
                <Form.Group controlId="login">
                    <Form.Label>Masukkan password admin</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={name} onChange={e => setName(e.target.value)} />
                </Form.Group>
                <Button className="mt-3 float-end" variant="primary" type="submit">Submit</Button>
            </Form>
        </Container>
    )
}