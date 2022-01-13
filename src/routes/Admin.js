import React, { useEffect } from 'react'
import { Container } from 'react-bootstrap'

export default function Admin() {

    useEffect(() => {
        document.title = "Admin Page";
    }, []);


    return (
        <Container>
            <h1>Admin Hello</h1>
        </Container>
    )
}
