"use client"

import styles from './page.module.css';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';

export default function RecoverPassword() {
    // generar los estados con modificadores
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState(null); // visibilidad del modal
    // generar un objeto del user parar enviar la data
    const [user, setUser] = useState(null);

    /**
     * Ocultar el modal
     */
    const handleClose = () => setShow(false);

    /**
     * Mostrar el modal
     */
    const handleShow = () => setShow(true);

    /**
     * verificar que la data ya esté preparada para enviar validando que user no sea null
     * 
     * @method localStorage.setItem - obtenida la data preparada para el envio al LS
     * @param [user] - evento que dispara el ciclo de vida del useEffect
     */
    useEffect(() => {
        user !== null && localStorage.setItem('Email', JSON.stringify(user));
    }, [user]);

    /** 
     * sanitizar el email para que quede en minúscula 
     * 
     * @param data - el valor del email ingresado 
     * @method slice - toma todos los caracteres, en este caso desde el comienzo ya que no se indica ningún parametro de inicio
     * @method toLowerCase - convierte en minúscula los caracteres
     */
    const emailToCapitalize = (data) => {
        let toCapitalize = null;
        if (data !== null && data !== undefined && data !== '') {
            toCapitalize = data.slice().toLowerCase();
        }
        return toCapitalize;
    };

    /** 
     * modificar el estado de 'user' con la data ingresada
     * 
     * @param value
     * @method preventDefault - permite que no se propague la accion del formulario 
     * para que vaya hacer algo en otro lado
     * @function handleClose - cerrar el modal al dar click en 'enviar'
     */
    const handleClick = (value) => {
        value.preventDefault();
        setUser({ email });
        handleClose();
    };

    /**
     * transpasar valores al estado
     * 
     * @param event - la data que ingresa ya capitalizada
     * @param setValue - obtener la data para el estado
     * @param capitalize - capitalizar el dato ingresado
     * @method event.target.value - obtener el valor ingresado 
     */
    const onChange = (event, setValue, capitalize) => {
        console.log(event.target.value); // ToDo: eliminar
        setValue(capitalize(event.target.value));
    };

    return (
        <>
            <span className={`${styles.fsMin9Modify}`}>
                <a
                    type="submit"
                    className={`link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 p-1`}
                    onClick={handleShow}>
                    Recupera tu contraseña
                </a>
            </span>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Cambia tu contraseña desde tu email</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <FloatingLabel controlId="email" label="Email" className={`my-2 text-secondary`}>
                            <Form.Control
                                required
                                type="email"
                                placeholder="name@example.com"
                                autoFocus
                                className={`rounded-4`}
                                onChange={event => onChange(event, setEmail, emailToCapitalize)}
                            />
                        </FloatingLabel>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleClick}>
                        Enviar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};