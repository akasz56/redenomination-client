import React from "react";
import { Container, Form, Button } from "react-bootstrap";
import { connectAdmin } from "../../common/adapters/authentication.adapter";
import { ROLE, setAuth } from "../../common/utils/authHandler";

export default function Login() {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [password, setPassword] = React.useState<string>("");

  React.useEffect(() => {
    document.title = "Masuk";
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    await connectAdmin(password)
      .then((res) => {
        if (res !== undefined) {
          setAuth(ROLE.ADMIN, res.token);
          window.location.href = "/";
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  if (loading) {
    return <h1>LOADING...</h1>;
  } else
    return (
      <Container>
        <Form className="mt-5" onSubmit={handleSubmit}>
          <Form.Group controlId="login">
            <Form.Label>Masukkan password admin</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button className="mt-3 float-end" variant="primary" type="submit">
            Masuk
          </Button>
        </Form>
      </Container>
    );
}
