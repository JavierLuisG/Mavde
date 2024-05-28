"use client";

import styles from './page.module.css';
import NavbarSystem from '../../../components/navbarSystem/page';
import Footer from '../../../components/footer/page';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // enrutar sin necesidad de elemento link, ejm: register -> home

export default function CreateProduct() {

    // generar los estados con modificadores
    const [sku, setSku] = useState();
    const [name, setName] = useState();
    const [productType, setProductType] = useState();
    const [quantity, setQuantity] = useState();
    const [price, setPrice] = useState();
    const [latitude, setLatitude] = useState();
    const [longitude, setLongitude] = useState();
    // generar un objeto del user parar enviar la data
    const [product, setProduct] = useState(null);

    // instancia de useRouter
    const router = useRouter();

    /**
     * verificar que la data ya esté preparada para enviar validando que product no sea null
     * 
     * @method localStorage.setItem - obtenida la data preparada para el envio al LS
     * @param [product] - evento que dispara el ciclo de vida del useEffect
     */
    useEffect(() => {
        product !== null && create();
    }, [product]);

    /**
     * implementar fetch para enviar datos por medio de la API
     * 
     * @method localStorage.setItem - obtenida la data preparada para el envio al LS
     * @param [product] - evento que dispara el ciclo de vida del useEffect
     */
    const create = () => {
        const url = `http://localhost:3001/api/v1/products/create`;
        const token = sessionStorage.getItem('token') || null;
        if (sku && product && token) {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` || ''
                },
                body: JSON.stringify(product)
            }).then(response => {
                if (response) {
                    return response.json();
                } else {
                    throw new Error('Network response was not ok.');
                }
            }).then(response => {
                localStorage.setItem('product', JSON.stringify({
                    sku_code: response.sku_code,
                    name: response.name,
                    product_type: response.product_type,
                    quantity: response.quantity,
                    price: response.price,
                    latitude: response.latitude,
                    longitude: response.longitude
                }));
                router.push('/products');
            }).catch(error => console.error(error));
        }
    };

    /** 
     * sanitizar para que quede la primera de cada palabra en mayúscula
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
     * transpasar valores al estado
     * 
     * @param event - la data que ingresa ya capitalizada
     * @param setValue - obtener la data para el estado
     * @param capitalize - capitalizar el dato ingresado
     * @method event.target.value - obtener el valor ingresado 
     */
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
        setProduct(buildData({
            skuCode: sku,
            name: name,
            productType: productType,
            quantity: quantity,
            price: price,
            latitude: latitude,
            longitude: longitude
        }));
    };

    const buildData = (data) => {
        let buil = null;
        if (data !== null && data !== undefined) {
            buil = {
                sku_code: data.skuCode,
                name: data.name,
                product_type: data.productType,
                quantity: data.quantity,
                price: data.price,
                latitude: data.latitude,
                longitude: data.longitude
            }
        }
        return buil;
    };

    return (
        <Container fluid className='p-0'>
            <NavbarSystem />
            <Row className={`my-5 text-center`}>
                <Col className={`d-flex flex-column align-items-center`}>
                    <span className={`text-center mb-3 fs-2 fw-semibold`}>
                        Crea tu producto
                    </span>
                    <Form>
                        <div className={`shadow-lg p-4 rounded-4 bg-white ${styles.inputWidthModify}`}>

                            <FloatingLabel controlId="firstname" label="SKU" className={`my-2 text-secondary`}>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="SKU"
                                    className={`rounded-4`}
                                    onChange={event => onChange(event, setSku, null)} />
                            </FloatingLabel>
                            <FloatingLabel controlId="firstname" label="Nombre" className={`my-2 text-secondary`}>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Nombre"
                                    className={`rounded-4`}
                                    onChange={event => onChange(event, setName, textToCapitalize)} />
                            </FloatingLabel>
                            <FloatingLabel controlId="firstname" label="Tipo de producto" className={`my-2 text-secondary`}>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Tipo de producto"
                                    className={`rounded-4`}
                                    onChange={event => onChange(event, setProductType, textToCapitalize)} />
                            </FloatingLabel>
                            <FloatingLabel controlId="lastname" label="Precio" className={`my-2 text-secondary`}>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Precio"
                                    className={`rounded-4`}
                                    onChange={event => onChange(event, setPrice, null)} />
                            </FloatingLabel>
                            <FloatingLabel controlId="lastname" label="Cantidad" className={`my-2 text-secondary`}>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Cantidad"
                                    className={`rounded-4`}
                                    onChange={event => onChange(event, setQuantity, null)} />
                            </FloatingLabel>
                            <FloatingLabel controlId="lastname" label="Latitud" className={`my-2 text-secondary`}>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Latitud"
                                    className={`rounded-4`}
                                    onChange={event => onChange(event, setLatitude, null)} />
                            </FloatingLabel>
                            <FloatingLabel controlId="lastname" label="Longitud" className={`my-2 text-secondary`}>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Longitud"
                                    className={`rounded-4`}
                                    onChange={event => onChange(event, setLongitude, null)} />
                            </FloatingLabel>
                            <Button
                                variant="primary"
                                type="submit"
                                className={`text-white w-100 my-2 p-2`}
                                onClick={handleClick}>
                                Confirmar
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
            <Footer />
        </Container>
    );
};