import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import socket from '../adapters/SocketIO';
import LoadingComponent from '../components/Loading';
import './Home.css';

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Redenomination Project App";
    });

    async function handleSubmit(e) {
        e.preventDefault();

        setLoading(true);
        socket.emit("loginToken", { "token": token });
        socket.emit("join", token);
        socket.on("serverMessage", res => {
            if (res.status === 200) {
                if (res.data.isSessionRunning) {
                    localStorage.setItem('auth', JSON.stringify({
                        login: true,
                        role: "participant",
                        id: res.data.detail.id,
                    }));
                    navigate('/participant', { state: res.data });
                    socket.off("serverMessage");
                } else {
                    window.alert("Simulasi belum dijalankan");
                    window.location.reload()
                }
            } else {
                console.log(res)
                const msg = "(" + res.status + ") " + res.message;
                window.alert(msg);
                setLoading(false);
            }
        })
    }

    if (loading) { return <LoadingComponent className='child' /> }
    else
        return (
            <Container>
                <h1 className="mt-5 title">Selamat Datang!</h1>
                <Form className="mt-3" onSubmit={handleSubmit}>
                    <Form.Group controlId="login">
                        <Form.Label>Masukkan token partisipan anda disini</Form.Label>
                        <Form.Control type="text" placeholder="Token" value={token} onChange={e => setToken(e.target.value)} />
                    </Form.Group>
                    <Button className="mt-3 float-end" variant="primary" type="submit">Masuk</Button>
                </Form>
            </Container >
        )
}
