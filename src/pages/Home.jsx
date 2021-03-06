import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import socket from "../adapters/SocketIO";
import LoadingComponent from "../components/Loading";
import "./Home.css";
import { alertUserSocket, saveAuth } from "../Utils";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Redenomination Project App";
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    socket.emit("loginToken", {
      token: token.toUpperCase(),
      username: username,
    });
    function loginTokenHandlerHome(res) {
      if (res.status === 200 && res.data.isSessionRunning) {
        saveAuth("participant", socket.id);
        navigate("/participant", { state: res.data });
        socket.off("serverMessage", loginTokenHandlerHome);
      } else {
        alertUserSocket(res);
        setLoading(false);
      }
    }
    socket.on("serverMessage", loginTokenHandlerHome);
  }

  if (loading) {
    return <LoadingComponent className="child" />;
  } else
    return (
      <Container>
        <h1 className="mt-5 title">Selamat Datang!</h1>
        <Form className="mt-3 row" onSubmit={handleSubmit}>
          <Form.Group controlId="login" className="col-md-6">
            <Form.Label className="required">
              Masukkan token partisipan anda disini
            </Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="Token"
              style={{ textTransform: "uppercase" }}
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="username" className="col-md-6">
            <Form.Label className="required">
              Masukkan username yang anda dapat disini
            </Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="Username"
              style={{ textTransform: "uppercase" }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <div className="position-relative mt-3 w-100">
            <Button
              className="position-absolute end-0 py-2 px-4"
              variant="primary"
              type="submit"
            >
              Masuk
            </Button>
          </div>
        </Form>
      </Container>
    );
}
