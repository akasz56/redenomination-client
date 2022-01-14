import React, { useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { isAdmin } from '../utils/Auth';

export default function Admin() {

    useEffect(() => {
        document.title = "Admin Page";
        isAdmin();
    }, []);

    return (
        <Container>
            <h1>Admin Hello</h1>
        </Container>
    )
}
