"use client";

import { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Col, Row } from 'react-bootstrap';
import styles from './page.module.css';
import NavbarSystem from '../../../components/navbarSystem/page';
import Footer from '../../../components/footer/page';
import Modal from 'react-bootstrap/Modal';
import RecoverPassword from "@/components/recoverPassword/page";
import { useRouter } from 'next/navigation'; // enrutar sin necesidad de elemento link, ejm: login -> home

export default function UserDetail(props) {
    const { email } = props.params || null;

    let [showEmail, setShowEmail] = useState('');
    let [firstname, setFirstname] = useState('');
    let [lastname, setLastname] = useState('');
    let [phone, setPhone] = useState('');
    let [userUpdate, setUserUpdate] = useState(null);

    let [editUserFlag, setEditUserFlag] = useState(true);

    const [show, setShow] = useState(false);

    const router = useRouter();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        if (email && userUpdate === null && editUserFlag === true) {
            const userSession = JSON.parse(localStorage.getItem('user')) || null;
            if (userSession) {
                setUserUpdate(userSession);
                setEditUserFlag(true);
                setShowEmail(userSession.email);
                setFirstname(userSession.firstname);
                setLastname(userSession.lastname);
                setPhone(userSession.phone);
            }
        }
    }, []);

    useEffect(() => {
        userUpdate && editUserFlag !== true && update();
    }, [userUpdate]);

    const update = () => {
        const user = JSON.parse(localStorage.getItem('user')) || null;
        const token = sessionStorage.getItem('token') || null;
        const url = `http://localhost:3001/api/v1/users/${email}/update`;
        if (userUpdate && email && user && token) {
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` || ''
                },
                body: JSON.stringify(userUpdate)
            }).then(response => {
                if (response) {
                    return response.json();
                } else {
                    throw new Error('Network response was not ok.');
                }
            }).then(response => {
                localStorage.setItem('user', JSON.stringify(
                    {
                        email: response.email,
                        firstname: response.firstname,
                        lastname: response.lastname,
                        phone: response.phone,
                        status: response.status,
                        id: response.id
                    }
                ));
                setEditUserFlag(true);
            }).catch(error => { console.error(error); });
        } else {
            setEditUserFlag(true);
        }
    };

    const deleteUser = () => {
        const user = JSON.parse(localStorage.getItem('user')) || null;
        const token = sessionStorage.getItem('token') || null;
        const url = `http://localhost:3001/api/v1/users/${email}/delete`;
        if (email && user && token) {
            fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` || ''
                }
            }).then(response => {
                localStorage.removeItem('user');
                sessionStorage.removeItem('token');
                setEditUserFlag(true);
                setShow(false);
                router.push('/');
            }).catch(error => {
                console.error(error);
            });
        } else {
            setEditUserFlag(false);
        }
    };

    /** 
     * sanitizar 'firstname' y 'lastname' para que quede la primera de cada palabra en mayúscula
     * 
     * @param data - el valor del texto ingresado 
     * @method slice - toma todos los caracteres desde donde se indicia, 
     * @method toUpperCase - convierte en mayúsculas los caracteres
     * @method toLowerCase - convierte en minúscula los caracteres
     */
    const textToCapitalize = (data) => {
        let toCapitalize = null;
        if (data !== null && data !== undefined && data !== '') {
            toCapitalize = data[0].toUpperCase() + data.slice(1).toLowerCase();
            toCapitalize = toCapitalize.split(" ").map(word => {
                if (word.length > 0) {
                    return word[0].toUpperCase() + word.slice(1).toLowerCase();
                }
                return '';
            }).join(" ");
        }
        return toCapitalize;
    };

    /**
     * recibir teléfono para verificar longitud correcta
     * 
     * @param phone - el valor del teléfono ingresao de tipo String
     */
    const phoneToCapitalize = (phone) => {
        let capitalize = null;
        if (phone.length === 10) {
            capitalize = phone;
        }
        return capitalize;
    };

    const onChange = (event, setValue, capitalize) => {
        if (capitalize !== null) {
            setValue(capitalize(event.target.value));
        } else {
            setValue(event.target.value);
        }
    };

    /** 
     * modificar el estado de 'user' con la data ingresada
     * 
     * @param value
     * @method preventDefault - permite que no se propague la accion del formulario 
     * para que vaya hacer algo en otro lado
     */
    const handleClick = (value) => {
        value.preventDefault();
        userUpdate && console.log(userUpdate);
        setUserUpdate(buildData({
            firstname: firstname,
            lastname: lastname,
            phone: phone
        }));
    };

    const buildData = (data) => {
        let build = null;
        if (data !== null && data !== undefined) {
            build = {
                firstname: data.firstname,
                lastname: data.lastname,
                phone: data.phone
            }
        }
        return build;
    };

    return (
        <Container fluid className='p-0'>
            <NavbarSystem />
            <Row className={`my-5 text-center`}>
                <Col className={`d-flex flex-column align-items-center`}>
                    <span className={`text-center mb-3 fs-2 fw-semibold`}>
                        Datos de tu perfil
                    </span>
                    <Form>
                        <div className={`shadow-lg p-4 rounded-4 bg-white ${styles.inputWidthModify}`}>
                            <FloatingLabel controlId="email" label="Email" className={`my-2 text-secondary`}>
                                <Form.Control
                                    type="email"
                                    placeholder="name@example.com"
                                    className={`rounded-4`}
                                    value={showEmail || ''}
                                    disabled={true} />
                            </FloatingLabel>
                            <FloatingLabel controlId="firstname" label="Nombre(s)" className={`my-2 text-secondary`}>
                                <Form.Control
                                    type="text"
                                    placeholder="Nombre(s)"
                                    className={`rounded-4`}
                                    value={firstname || ''}
                                    disabled={editUserFlag}
                                    onChange={event => onChange(event, setFirstname, textToCapitalize)} />
                            </FloatingLabel>
                            <FloatingLabel controlId="lastname" label="Apellido(s)" className={`my-2 text-secondary`}>
                                <Form.Control
                                    type="text"
                                    placeholder="Apellido(s)"
                                    className={`rounded-4`}
                                    value={lastname || ''}
                                    disabled={editUserFlag}
                                    onChange={event => onChange(event, setLastname, textToCapitalize)} />
                            </FloatingLabel>
                            <FloatingLabel controlId="phone" label="Teléfono" className={`my-2 text-secondary`}>
                                <Form.Control
                                    type="text"
                                    placeholder="Teléfono"
                                    className={`rounded-4`}
                                    value={phone || ''}
                                    disabled={editUserFlag}
                                    onChange={event => onChange(event, setPhone, phoneToCapitalize)} />
                            </FloatingLabel>
                            {
                                email && userUpdate && editUserFlag ?
                                    <Button
                                        variant="primary"
                                        type="button"
                                        className={`text-white w-100 my-3 p-2`}
                                        onClick={event => setEditUserFlag(false)}
                                    >
                                        Editar
                                    </Button> :
                                    <div>
                                        <div className="d-flex justify-content-evenly">
                                            <Button
                                                variant="danger"
                                                type="button"
                                                className={`text-white w-30 my-3 p-2`}
                                                onClick={handleShow}
                                            >
                                                Eliminar
                                            </Button>
                                            <Modal
                                                show={show}
                                                onHide={handleClose}
                                                backdrop="static"
                                                keyboard={false}
                                            >
                                                <Modal.Header closeButton>
                                                    <Modal.Title>Atención</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    ¿Seguro deseas eliminar tu usuario?
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button variant="secondary" onClick={handleClose}>
                                                        Cerrar
                                                    </Button>
                                                    <Button variant="danger" onClick={deleteUser}>
                                                        Aceptar
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal>
                                            <Button
                                                variant="primary"
                                                type="button"
                                                className={`text-white w-30 my-3 p-2`}
                                                onClick={handleClick}
                                            >
                                                Guardar
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                type="button"
                                                className={`text-white w-30 my-3 p-2`}
                                                onClick={event => setEditUserFlag(true)}
                                            >
                                                Cancelar
                                            </Button>
                                        </div>
                                        <div>
                                            <RecoverPassword />
                                        </div>
                                    </div>
                            }
                        </div>
                    </Form>
                    <span className={`text-center mt-3 mb-5 ${styles.fsMin9Modify}`}>
                        Verifica tus datos ingresados
                        <br />
                        Recuerda proteger tus datos
                    </span>
                </Col>
            </Row>
            <Footer />
        </Container>
    );
};