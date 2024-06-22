"use client";

import { Col, Row } from 'react-bootstrap';
import NavbarSystem from '../../components/navbarSystem/page';
import Footer from '../../components/footer/page';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export default function PrincipalPage() {
  return (
    <Container fluid className='p-0'>
      <NavbarSystem />
      <Row className={`align-items-center text-center`}>
        <Row className='bg-light py-5'>
          <h1>Mavde to Admin</h1>
          <h3>
            Diseñado para la comodidad de tus gestiones.
          </h3>
        </Row>
        <Col className={`d-flex justify-content-evenly`}>
          <Card className='m-3' style={{ width: '18rem' }}>
            <Card.Img variant="top" src="https://i.pinimg.com/564x/a7/f9/8d/a7f98df6eaf31d59faa982e897eaca51.jpg" />
            <Card.Body>
              <Card.Title>Clientes</Card.Title>
              <Card.Text>
                Visualiza y gestiona todos tus clientes de manera eficiente.
              </Card.Text>
              <Button
                className={'w-100'}
                variant="primary"
                href={'/users'}>
                Seleccionar
              </Button>
            </Card.Body>
          </Card>
          <Card className='m-3' style={{ width: '18rem' }}>
            <Card.Img variant="top" src="https://i.pinimg.com/564x/13/87/44/138744674aa19b0f1113df99158a5cb0.jpg" />
            <Card.Body>
              <Card.Title>Productos</Card.Title>
              <Card.Text>
                Administra tu catálogo de productos de forma sencilla.
              </Card.Text>
              <Button
                className={'w-100'}
                variant="primary"
                href={'/products'}>
                Seleccionar
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Footer />
    </Container>
  );
}
