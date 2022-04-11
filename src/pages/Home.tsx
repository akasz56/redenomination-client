import React from "react";
import { Button, Container, Form } from "react-bootstrap";
import { StyleSheet, css } from "aphrodite";

export default function Home() {
  const styles = StyleSheet.create({
    title: {
      fontWeight: "bold",
      fontSize: "3.5em",
    },
  });

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
  }

  return (
    <Container>
      <h1 className={"mt-5 " + css(styles.title)}>Selamat Datang!</h1>
      <Form className="mt-3 row" onSubmit={handleLogin}>
        <Form.Group controlId="login" className="col-md-6">
          <Form.Label className="required">
            Masukkan token partisipan anda disini
          </Form.Label>
          <Form.Control
            type="text"
            required
            placeholder="Token"
            style={{ textTransform: "uppercase" }}
            // value={token}
            // onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToken(e.target.value)}
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
            // value={username}
            // onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
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
