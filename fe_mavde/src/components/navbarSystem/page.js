"use client";

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default function NavbarHome() {

    let [email, setEmail] = useState(null);

    /**
     * Se prepara el email que será enviado por /users/[email] para que alli se pueda obtener por medio del promps
     */
    useEffect(() => {
        if (email === null) {
            const getData = JSON.parse(localStorage.getItem('user'));
            if (getData !== null) {
                setEmail(getData.email);
            }
        }
    }, []);

    /**
     * Salir del sistema borrando el LS y SS 
     */
    const exit = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('product');
        sessionStorage.removeItem('token');
    }


    return (
        <>
            <div className={`pb-2 sticky-top ${styles.bgPrincipalToneModify}`}>
                <Navbar expand="lg" className={`${styles.principalToneModify}`}>
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
                                    href={'/principalPage'}>
                                    Inicio
                                </Nav.Link>
                                <Nav.Link
                                    className={`nav-link active text-white mx-1`}
                                    href={'/users'}>
                                    Clientes
                                </Nav.Link>
                                <Nav.Link
                                    className={`nav-link active text-white mx-1`}
                                    href={'/products'}>
                                    Productos
                                </Nav.Link>
                                <Nav.Link
                                    className={`nav-link active text-white mx-1`}
                                    href={`/users/${email}`}>
                                    Perfil
                                </Nav.Link>
                                <div className="mx-3 vr bg-white" />
                                <Nav.Link
                                    className={`nav-link active text-white mx-1`}
                                    href={'/'}
                                    onClick={exit}>
                                    Salir
                                </Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>
        </>
    );
};