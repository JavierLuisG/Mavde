"use client";

import NavbarSystem from '../../../components/navbarSystem/page';
import Footer from '../../../components/footer/page';
import { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Col, Row } from 'react-bootstrap';
import styles from './page.module.css';
import Modal from 'react-bootstrap/Modal';
import { useRouter } from 'next/navigation'; // enrutar sin necesidad de elemento link, ejm: login -> home

export default function ProductDetail(props) {
    const { sku } = props.params || null;

    let [showSku, setShowSku] = useState('');
    let [showName, setShowName] = useState('');
    let [productType, setProductType] = useState('');
    let [quantity, setQuantity] = useState('');
    let [price, setPrice] = useState('');
    let [latitude, setLatitude] = useState('');
    let [longitude, setLongitude] = useState('');
    let [productUpdate, setProductUpdate] = useState(null);
    let [editProductFlag, setEditProductFlag] = useState(true);
    
    const [show, setShow] = useState(false);    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const router = useRouter();

    useEffect(() => {
        if (sku && productUpdate === null && editProductFlag === true) {
            const productSession = JSON.parse(localStorage.getItem('product')) || null;
            console.log(productSession);
            if (productSession) {
                setProductUpdate(productSession);
                setEditProductFlag(true);
                setShowSku(productSession.sku_code);
                setShowName(productSession.name);
                setProductType(productSession.product_type);
                setQuantity(productSession.quantity);
                setPrice(productSession.price);
                setLatitude(productSession.latitude);
                setLongitude(productSession.longitude);
            }
        }
    }, []);

    useEffect(() => {
        productUpdate && editProductFlag !== true && update();
    }, [productUpdate]);

    const update = () => {
        const product = JSON.parse(localStorage.getItem('product')) || null;
        console.log('product en update ', product)
        const token = sessionStorage.getItem('token') || null;
        const url = `http://localhost:3001/api/v1/products/${sku}/update`;
        if (productUpdate && sku && product && token) {
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` || ''
                },
                body: JSON.stringify(productUpdate)
            }).then(response => {
                if (response) {
                    return response.json();
                } else {
                    throw new Error('Network response was not ok.');
                }
            }).then(response => {
                localStorage.setItem('product', JSON.stringify(
                    {
                        sku_code: response.sku_code,
                        name: response.name,
                        product_type: response.productType,
                        quantity: response.quantity,
                        price: response.price,
                        latitude: response.latitude,
                        longitude: response.longitude
                    }
                ));
                setEditProductFlag(true);
            }).catch(error => { console.error(error); });
        } else {
            setEditProductFlag(true);
        }
    };

    const deleteProduct = () => {
        const product = JSON.parse(localStorage.getItem('product')) || null;
        console.log('Este es el product: ', product);
        const token = sessionStorage.getItem('token') || null;
        const url = `http://localhost:3001/api/v1/products/${sku}/delete`;
        if (sku && product && token) {
            console.log('Entró al fetch');
            fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` || ''
                }
            }).then(response => {
                localStorage.removeItem('product');
                setEditProductFlag(true);
                setShow(false);
                router.push('/products');
            }).catch(error => {
                console.error(error);
            });
        } else {
            setEditProductFlag(false);
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

    const onChange = (event, setValue, capitalize) => {
        if (capitalize !== null) {
            setValue(capitalize(event.target.value));
        } else {
            setValue(event.target.value);
        }
    };

    /** 
     * modificar el estado de 'product' con la data ingresada
     * 
     * @param value
     * @method preventDefault - permite que no se propague la accion del formulario 
     * para que vaya hacer algo en otro lado
     */
    const handleClick = (value) => {
        value.preventDefault();
        productUpdate && console.log(productUpdate);
        setProductUpdate(buildData({
            productType: productType,
            quantity: quantity,
            price: price,
            latitude: latitude,
            longitude: longitude
        }));
    };

    const buildData = (data) => {
        let build = null;
        if (data !== null && data !== undefined) {
            build = {
                product_type: data.productType,
                quantity: data.quantity,
                price: data.price,
                latitude: data.latitude,
                longitude: data.longitude
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
                        Datos de tu producto
                    </span>
                    <Form>
                        <div className={`shadow-lg p-4 rounded-4 bg-white ${styles.inputWidthModify}`}>
                            <FloatingLabel controlId="firstname" label="SKU" className={`my-2 text-secondary`}>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="SKU"
                                    className={`rounded-4`}
                                    value={showSku || ''}
                                    disabled={true} />
                            </FloatingLabel>
                            <FloatingLabel controlId="firstname" label="Nombre" className={`my-2 text-secondary`}>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Nombre"
                                    className={`rounded-4`}
                                    value={showName || ''}
                                    disabled={true} />
                            </FloatingLabel>
                            <FloatingLabel controlId="firstname" label="Tipo de producto" className={`my-2 text-secondary`}>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Tipo de producto"
                                    className={`rounded-4`}
                                    value={productType || ''}
                                    disabled={editProductFlag}
                                    onChange={event => onChange(event, setProductType, textToCapitalize)} />
                            </FloatingLabel>
                            <FloatingLabel controlId="lastname" label="Precio" className={`my-2 text-secondary`}>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Precio"
                                    className={`rounded-4`}
                                    value={price || ''}
                                    disabled={editProductFlag}
                                    onChange={event => onChange(event, setPrice, null)} />
                            </FloatingLabel>
                            <FloatingLabel controlId="lastname" label="Cantidad" className={`my-2 text-secondary`}>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Cantidad"
                                    className={`rounded-4`}
                                    value={quantity || ''}
                                    disabled={editProductFlag}
                                    onChange={event => onChange(event, setQuantity, null)} />
                            </FloatingLabel>
                            <FloatingLabel controlId="lastname" label="Latitud" className={`my-2 text-secondary`}>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Latitud"
                                    className={`rounded-4`}
                                    value={latitude || ''}
                                    disabled={editProductFlag}
                                    onChange={event => onChange(event, setLatitude, null)} />
                            </FloatingLabel>
                            <FloatingLabel controlId="lastname" label="Longitud" className={`my-2 text-secondary`}>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Longitud"
                                    className={`rounded-4`}
                                    value={longitude || ''}
                                    disabled={editProductFlag}
                                    onChange={event => onChange(event, setLongitude, null)} />
                            </FloatingLabel>
                            {
                                sku && productUpdate && editProductFlag ?
                                    <Button
                                        variant="primary"
                                        type="button"
                                        className={`text-white w-100 my-3 p-2`}
                                        onClick={event => setEditProductFlag(false)}
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
                                                    ¿Seguro deseas eliminar este producto?
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button variant="secondary" onClick={handleClose}>
                                                        Cerrar
                                                    </Button>
                                                    <Button variant="danger" onClick={deleteProduct}>
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
                                                onClick={event => setEditProductFlag(true)}
                                            >
                                                Cancelar
                                            </Button>
                                        </div>
                                    </div>
                            }
                        </div>
                    </Form>
                </Col>
            </Row>
            <Footer />
        </Container>
    );
};