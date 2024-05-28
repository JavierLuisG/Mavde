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
import { useRouter } from 'next/navigation';

export default function Products() {

    const [products, setProducts] = useState(null);

    const [oneProduct, setOneProduct] = useState(null);
    const router = useRouter();

    useEffect(() => {
        getAllProducts();
    }, []);

    const getAllProducts = () => {
        const url = `http://localhost:3001/api/v1/products`;
        fetch(url, {
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(response => {
            if (response) {
                return response.json();
            } else {
                throw new Error('Network response was not ok.');
            }
        }).then(response => {
            products === null && setProducts(response);
        }).catch(error => console.log(error));
    };

    const getProduct = (code) => {
        const url = `http://localhost:3001/api/v1/products/${code}/detail`;
        fetch(url, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response) {
                return response.json();
            } else {
                throw new Error('Network response was not ok.');
            }
        }).then(response => {
            setOneProduct(response);
            localStorage.setItem('product', JSON.stringify({
                id: response.id,
                sku_code: response.sku_code,
                name: response.name,
                product_type: response.product_type,
                quantity: response.quantity,
                price: response.price,
                latitude: response.latitude,
                longitude: response.longitude
            }));
            router.push(`/products/${code}`);
        }).catch(error => console.log(error));
    };

    return (
        <Container fluid className='p-0'>
            <NavbarSystem />
            <Row className={`my-2 text-center`}>
                <Col className={`d-flex flex-column align-items-center`}>
                    <Row className={`mx-auto p-4 d-flex justify-content-center`}>
                        <Stack direction="horizontal" gap={3}>
                            <Form.Control className="me-auto" placeholder="Ingresa el SKU del producto" />
                            <Button variant="primary">Buscar</Button>
                        </Stack>
                        <Button className='m-3 w-50' variant="success" href='/products/create'>Crea tu nuevo producto</Button>
                    </Row>
                    <Row className="d-flex justify-content-evenly">
                        {products && products.length > 0 && products.map(product => (
                            <Card className="my-3 shadow-sm" key={product.id} style={{ width: '18rem' }}>
                                <Card.Body
                                    onClick={value => getProduct(product.sku_code)}>
                                    <Card.Title>{product.name}</Card.Title>
                                    <Card.Text>
                                        SKU: {product.sku_code} <br />
                                        Tipo: {product.product_type} <br />
                                        Cantidad disponible: {product.quantity} <br />
                                        Latitud: {product.latitude} <br />
                                        Longitud: {product.longitude} <br />
                                        Precio: {product.price}
                                    </Card.Text>
                                    <Button variant="primary w-100">Seleccionar</Button>
                                </Card.Body>
                            </Card>
                        ))}
                    </Row>
                </Col>
            </Row>
            <Footer />
        </Container >
    );
};