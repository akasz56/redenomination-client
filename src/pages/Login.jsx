import { useEffect, useState } from 'react'
import { Container, Form, Button } from 'react-bootstrap';
import { connectAsAdmin } from "../adapters/Authentication";
import LoadingComponent from '../components/Loading';
import { myRole, saveAuth } from '../Utils';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");

    useEffect(() => {
        document.title = "Masuk";
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();

        if (myRole()) {
            alert(`Anda sudah masuk sebagai ${myRole()}`)
            window.location.href = "/admin";
        }

        setLoading(true)
        const res = await connectAsAdmin(password);
        if (res.status === 200) {
            saveAuth('admin', "Bearer " + res.data.jwtToken)
            window.location.href = "/admin";
        } else if (res.status === 401) {
            setLoading(false)
            setPassword("");
            alert("Password Salah");
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
                <Form className="mt-5" onSubmit={handleSubmit}>
                    <Form.Group controlId="login">
                        <Form.Label>Masukkan password admin</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                    </Form.Group>
                    <Button className="mt-3 float-end" variant="primary" type="submit">Masuk</Button>
                </Form>
            </Container>
        )
}