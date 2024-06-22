"use client";

import styles from './page.module.css';
import NavbarHome from '../../components/navbarHome/page';
import Footer from '../../components/footer/page';
import RecoverPassword from '../../components/recoverPassword/page';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // enrutar sin necesidad de elemento link

export default function Login() {

    // generar los estados con modificadores
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    // generar un objeto del user parar enviar la data
    const [user, setUser] = useState(null);

    // instancia de useRouter
    const router = useRouter();

    /**
     * verificar que la data ya esté preparada para enviar validando que user no sea null
     * 
     * @method localStorage.setItem - obtenida la data preparada para el envio al LS
     * @param [user] - evento que dispara el ciclo de vida del useEffect
     */
    useEffect(() => {
        if (user !== null && user !== undefined) {
            login();
        }
    }, [user]);

    /**
     * implementar fetch para enviar datos por medio de la API
     * 
     * @method localStorage.setItem - obtenida la data preparada para el envio al LS
     * @param [user] - evento que dispara el ciclo de vida del useEffect
     * @method router.push - generar interacción a otra ruta
     */
    const login = () => {
        const url = `http://localhost:3001/api/v1/users/authenticate`;
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        }).then(response => {
            if (response) {
                return response.json();
            } else {
                throw new Error('Network response was not ok.');
            }
        }).then(response => {
            localStorage.setItem('user', JSON.stringify({
                id: response.id,
                email: response.email,
                firstname: response.firstname,
                lastname: response.lastname,
                phone: response.phone
            }));
            sessionStorage.setItem('token', response.token);
            router.push('/principalPage');
        }).catch(error => console.error(error));
    };

    /** 
     * sanitizar el email para que quede en minúscula 
     * 
     * @param data - el valor del email ingresado 
     * @method slice - toma todos los caracteres, en este caso desde el comienzo ya que no se indica ningun parametro de inicio
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
     * sanitizar la contraseña para que quede encriptada con BTOA
     * 
     * @param data - el valor del password ingresado 
     * @method btoa - se realiza la encriptación del valor ingresado
     */
    const encodeBase64 = (data) => {
        let encodedStringToBtoA = undefined;
        if (data !== null && data !== undefined && data !== '') {
            encodedStringToBtoA = btoa(data);
        }
        return encodedStringToBtoA;
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
        setUser({ email, password });
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
        setValue(capitalize(event.target.value));
    };

    return (
        <Container fluid className='p-0'>
            <NavbarHome />
            <Container className={`my-5 text-center`}>
                <Row>
                    <Col className={`d-flex justify-content-center`}>
                        <img src="/img/image3.png" className={`${styles.imgWidth}`}></img>
                    </Col>
                    <Col className={`d-flex flex-column align-items-center`}>
                        <span className={`text-center mb-3 fs-2 fw-semibold`}>
                            Bienvenido nuevamente
                        </span>
                        <Form>
                            <div className={`pb-2 ${styles.fsMin9Modify}`}>
                                ¿Aún no tienes tu cuenta?
                                <a
                                    href={'register'}
                                    type="link"
                                    className={`link-offset-2 link-underline link-underline-opacity-0 w-100 p-1 ${styles.textColor}`}>
                                    Registrate
                                </a>
                            </div>
                            <div className={`shadow p-4 rounded-4 bg-white ${styles.inputWidthModify}`}>
                                <FloatingLabel controlId="email" label="Email" className={`my-2 text-secondary`}>
                                    <Form.Control
                                        required
                                        type="email"
                                        placeholder="name@example.com"
                                        className={`rounded-3`}
                                        onChange={event => onChange(event, setEmail, emailToCapitalize)} />
                                </FloatingLabel>
                                <FloatingLabel controlId="password" label="Contraseña" className={`my-2 text-secondary`}>
                                    <Form.Control
                                        required
                                        type="password"
                                        placeholder="Password"
                                        className={`rounded-3`}
                                        onChange={event => onChange(event, setPassword, encodeBase64)} />
                                </FloatingLabel>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    className={`text-white w-100 my-2 p-2`}
                                    onClick={handleClick}>
                                    Ingresa
                                </Button>
                                <div>
                                    <RecoverPassword />
                                </div>
                            </div>
                        </Form>
                        <span className={`text-center mt-3 ${styles.fsMin9Modify}`}>
                            Recuerda proteger tus datos
                        </span>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </Container>
    );
};