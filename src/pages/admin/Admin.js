import React, { useEffect } from 'react'
import { Container, Button } from 'react-bootstrap'
import { logout, isAdmin } from '../../utils/Auth';

export default function Admin() {

    useEffect(() => {
        document.title = "Admin Page";
        isAdmin();
    }, []);

    const handlerClick = (event) => {
        event.preventDefault();
        logout(() => {
            window.location.href = "/";
        });
    }
    return (
        <Container>
            <h1>Admin Hello</h1>
            <Button variant="danger" onClick={handlerClick}>Log Out</Button>
        </Container>
    )
}
