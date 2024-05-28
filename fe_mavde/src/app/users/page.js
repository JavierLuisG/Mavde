"use client";

import NavbarSystem from '../../components/navbarSystem/page';
import Footer from '../../components/footer/page';
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import { Col, Row } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';

export default function Users() {

    const [users, setUsers] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        if (users === null) {
            getAllUsers();
        }
    }, [token]);

    useEffect(() => {
        if (token === null) {
            getToken();
        }
    }, []);

    // no tiene body
    const getAllUsers = () => {
        const url = `http://localhost:3001/api/v1/users`;
        fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        }).then(response => {
            if (response) {
                return response.json();
            } else {
                throw new Error('Network response was not ok.');
            }
        }).then(response => {
            users === null && setUsers(response);
        }).catch(error => console.log(error));
    };

    const getToken = () => {
        const tokenForSession = sessionStorage.getItem('token');
        if (tokenForSession !== null && token === null) {
            setToken(tokenForSession);
        }
    };

    return (
        <Container fluid className='p-0'>
            <NavbarSystem />
            <Row className={`my-2 text-center`}>
                <Col className={`d-flex flex-column align-items-center`}>
                    <Row className={`mx-auto p-4 d-flex justify-content-center`}>
                        <Stack direction="horizontal" gap={3}>
                            <Form.Control className="me-auto" placeholder="Ingresa el email del cliente" />
                            <Button variant="primary">Buscar</Button>
                        </Stack>
                    </Row>
                    <Row className="d-flex justify-content-evenly">
                        {users && users.length > 0 && users.map(user => (
                            <Card className={`my-2 mx-4 p-0 shadow-sm`} key={user.id} style={{ width: '25rem' }}>
                                <Card.Body>
                                    <Card.Title>{user.email}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">{user.firstname} {user.lastname}</Card.Subtitle>
                                    <Card.Text>{user.phone}</Card.Text>
                                </Card.Body>
                            </Card>
                        ))}
                    </Row>
                </Col>
            </Row>
            <Footer />
        </Container>
    );
    /*
        return (
            <Container fluid className='p-0'>
                <NavbarSystem />
                <Row className={`my-2 text-center`}>
                    <Col className={`d-flex flex-column align-items-center`}>
                        <Row className={`mx-auto p-4 d-flex justify-content-center`}>
                            <Stack direction="horizontal" gap={3}>
                                <Form.Control className="me-auto" placeholder="Ingresa el email" />
                                <Button variant="primary">Buscar</Button>
                            </Stack>
                        </Row>
                        <Row>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Nombre(s)</th>
                                        <th>Apellido(s)</th>
                                        <th>Email</th>
                                        <th>phone</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users && users.length > 0 && users.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.firstname}</td>
                                            <td>{user.lastname}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phone}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Row>
                    </Col>
                </Row>
                <Footer />
            </Container>
        ); */
};