"use client";

import styles from './page.module.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default function NavbarHome() {
    return (
        <>
            <Navbar expand="lg" className={`sticky-top ${styles.principalToneModify}`}>
                <Container fluid>
                    <Navbar.Brand
                        className={`navbar-brand text-white fw-bold mx-4 fs-4`}
                        href={'/'}>
                        Mavde
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link
                                className={`nav-link active text-white mx-1`}
                                href={'/'}>
                                Inicio
                            </Nav.Link>
                            <Nav.Link
                                className={`nav-link active text-white mx-1`}
                                href={'login'}>
                                Ingresar
                            </Nav.Link>
                            <Nav.Link
                                className={`nav-link active text-white mx-1`}
                                href={'register'}>
                                Registrarse
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};