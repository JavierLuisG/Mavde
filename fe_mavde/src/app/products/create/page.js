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
    const [genderType, setGenderType] = useState();
    const [quantity, setQuantity] = useState();
    const [price, setPrice] = useState();
    const [color, setColor] = useState();    
    const [brand, setBrand] = useState();    
    const [size, setSize] = useState();    
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
                    gender_type: response.gender_type,
                    quantity: response.quantity,
                    price: response.price,
                    color: response.color,
                    brand: response.brand,
                    size: response.size
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
            genderType: genderType,
            quantity: quantity,
            color: color,
            price: price,
            brand: brand,
            size: size
        }));
    };

    const buildData = (data) => {
        let buil = null;
        if (data !== null && data !== undefined) {
            buil = {
                sku_code: data.skuCode,
                name: data.name,
                gender_type: data.genderType,
                quantity: data.quantity,
                price: data.price,
                color: data.color,
                brand: data.brand,
                size: data.size
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

                            <FloatingLabel controlId="sku" label="SKU" className={`my-2 text-secondary`}>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="SKU"
                                    className={`rounded-4`}
                                    onChange={event => onChange(event, setSku, null)} />
                            </FloatingLabel>
                            <FloatingLabel controlId="name" label="Nombre" className={`my-2 text-secondary`}>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Nombre"
                                    className={`rounded-4`}
                                    onChange={event => onChange(event, setName, textToCapitalize)} />
                            </FloatingLabel>
                            <FloatingLabel controlId="brand" label="Marca" className={`my-2 text-secondary`}>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="brand"
                                    className={`rounded-4`}
                                    onChange={event => onChange(event, setBrand, textToCapitalize)} />
                            </FloatingLabel>
                            <FloatingLabel controlId="gender" label="Género" className={`my-2 text-secondary`}>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Género"
                                    className={`rounded-4`}
                                    onChange={event => onChange(event, setGenderType, textToCapitalize)} />
                            </FloatingLabel>
                            <FloatingLabel controlId="color" label="Color" className={`my-2 text-secondary`}>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Color"
                                    className={`rounded-4`}
                                    onChange={event => onChange(event, setColor, textToCapitalize)} />
                            </FloatingLabel>
                            <FloatingLabel controlId="size" label="Talla" className={`my-2 text-secondary`}>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Talla"
                                    className={`rounded-4`}
                                    onChange={event => onChange(event, setSize, null)} />
                            </FloatingLabel>
                            <FloatingLabel controlId="price" label="Precio por unidad" className={`my-2 text-secondary`}>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Precio por unidad"
                                    className={`rounded-4`}
                                    onChange={event => onChange(event, setPrice, null)} />
                            </FloatingLabel>
                            <FloatingLabel controlId="quantity" label="Cantidad" className={`my-2 text-secondary`}>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Cantidad"
                                    className={`rounded-4`}
                                    onChange={event => onChange(event, setQuantity, null)} />
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