import { useEffect, useState } from 'react'
import { Container, Form, Button } from 'react-bootstrap';
import { connectAsAdmin } from "../adapters/Authentication";
import { myRole } from '../Utils';

export default function Login() {
    const [password, setPassword] = useState("");

    useEffect(() => {
        document.title = "Login as Admin";
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (myRole()) {
            alert(`Anda sudah login sebagai ${myRole()}`)
            window.location.href = "/admin";
        }

        const res = await connectAsAdmin(password);
        if (res.status === 200) {
            localStorage.setItem('auth', JSON.stringify({
                login: true,
                role: "admin",
                token: "Bearer " + res.data.jwtToken
            }));
            window.location.href = "/admin";
        } else if (res.status === 401) {
            alert("Password Salah");
            setPassword("");
        } else {
            console.log(res);
            alert("Terdapat kesalahan");
        }
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