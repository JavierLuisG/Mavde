"use client";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';

export default function SearchUser() {



    return (
        <>
            <Stack direction="horizontal" gap={3}>
                <Form.Control className="me-auto" placeholder="Ingresa el email del cliente" />
                <Button variant="primary">Buscar</Button>
            </Stack>
        </>
    )
}