"use client";

import styles from './page.module.css';
import NavbarHome from '../../components/navbarHome/page';
import Footer from '../../components/footer/page';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // enrutar sin necesidad de elemento link, ejm: register -> home

export default function Register() {

    // generar los estados con modificadores
    const [email, setEmail] = useState();
    const [firstname, setFirstname] = useState();
    const [lastname, setLastname] = useState();
    const [phone, setPhone] = useState();
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
        user !== null && register();
    }, [user]);

    /**
     * implementar fetch para enviar datos por medio de la API
     * 
     * @method localStorage.setItem - obtenida la data preparada para el envio al LS
     * @param [user] - evento que dispara el ciclo de vida del useEffect
     */
    const register = () => {
        const url = `http://localhost:3001/api/v1/users/create`;
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
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
                phone: response.phone,
                status: response.status
            }));
            router.push('/login');
        }).catch(error => console.error(error));
    };

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

    /** 
     * modificar el estado de 'user' con la data ingresada
     * 
     * @param value
     * @method preventDefault - permite que no se propague la accion del formulario 
     * para que vaya hacer algo en otro lado
     */
    const handleClick = (value) => {
        value.preventDefault();
        setUser(buildData({
            email: email,
            firstname: firstname,
            lastname: lastname,
            phone: phone,
            password: password
        }));
    };

    const buildData = (data) => {
        let buil = null;
        if (data !== null && data !== undefined) {
            buil = {
                email: data.email,
                firstname: data.firstname,
                lastname: data.lastname,
                phone: data.phone,
                password: data.password
            }
        }
        return buil;
    };

    return (
        <Container fluid className='p-0'>
            <NavbarHome />
            <Row className={`my-5 text-center`}>
                <Col className={`d-flex flex-column align-items-center`}>
                    <span className={`text-center mb-3 fs-2 fw-semibold`}>
                        Crea tu cuenta
                    </span>
                    <Form>
                        <div className={`shadow-lg p-4 rounded-4 bg-white ${styles.inputWidthModify}`}>
                            <FloatingLabel controlId="email" label="Email" className={`my-2 text-secondary`}>
                                <Form.Control
                                    required
                                    type="email"
                                    placeholder="name@example.com"
                                    className={`rounded-3`}
                                    onChange={event => onChange(event, setEmail, emailToCapitalize)} />
                            </FloatingLabel>
                            <FloatingLabel controlId="firstname" label="Nombre(s)" className={`my-2 text-secondary`}>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Nombre(s)"
                                    className={`rounded-3`}
                                    onChange={event => onChange(event, setFirstname, textToCapitalize)} />
                            </FloatingLabel>
                            <FloatingLabel controlId="lastname" label="Apellido(s)" className={`my-2 text-secondary`}>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Apellido(s)"
                                    className={`rounded-3`}
                                    onChange={event => onChange(event, setLastname, textToCapitalize)} />
                            </FloatingLabel>
                            <FloatingLabel controlId="phone" label="Teléfono" className={`my-2 text-secondary`}>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Teléfono"
                                    className={`rounded-3`}
                                    onChange={event => onChange(event, setPhone, phoneToCapitalize)} />
                            </FloatingLabel>
                            <FloatingLabel controlId="password" label="Contraseña" className={`my-2 text-secondary`}>
                                <Form.Control
                                    required
                                    type="password"
                                    placeholder="Password"
                                    className={`rounded-3`}
                                    onChange={event => onChange(event, setPassword, encodeBase64)} />
                            </FloatingLabel>
                            <div className="text-start">
                                <Button
                                    variant="link"
                                    className={`link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover ${styles.fsMin9Modify}`}>
                                    Términos y condiciones
                                </Button>
                            </div>
                            <div className={`form-check text-start`}>
                                <input type="checkbox" className={`form-check-input`} id="exampleCheck1" />
                                <label className={`form-check-label ${styles.fsMin9Modify}`}>
                                    Aceptar TyC
                                </label>
                            </div>
                            <Button
                                variant="primary"
                                type="submit"
                                className={`text-white w-100 my-2 p-2`}
                                onClick={handleClick}>
                                Confirmar
                            </Button>
                        </div>
                    </Form>
                    <span className={`text-center mt-3 ${styles.fsMin9Modify}`}>
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