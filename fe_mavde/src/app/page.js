"use client";

import { Row, Col } from 'react-bootstrap';
import NavbarHome from '../components/navbarHome/page';
import Footer from '../components/footer/page';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';

export default function Home() {
  return (
    <Container fluid className='p-0'>
      <NavbarHome />
      <Container fluid className='bg-primary-subtle text-center py-5'>
        <h1>Mavde to Admin</h1>
        <h3>
          Diseñado para la comodidad de tus gestiones.
        </h3>
      </Container>
      <Row className='mx-4 my-5'>
        <Col>
          <h2>Sobre Nosotros</h2>
          <p>
            Nos dedicamos a ayudar a las empresas a gestionar eficientemente sus clientes y productos. Nuestro sistema Mavde to Admin, está diseñado específicamente para la comodidad de tus gestiones diarias.
          </p>
          <p>
            Con Mavde to Admin, podrás:
            Gestionar tu inventario de productos, incluyendo todas las tallas y modelos de tus productos.
            Administrar proveedores de manera eficiente, asegurando un flujo constante de productos.
            Estamos en constante desarrollo para asegurar que nuestras soluciones sean innovadoras y estén alineadas con las últimas tendencias del mercado. Mavde to Admin es tu herramienta ideal para simplificar la administración de tu tienda online y enfocarte en lo que realmente importa: el crecimiento de tu negocio.
          </p>
          <p>
            Ofrecemos una plataforma intuitiva para que los administradores de tiendas online gestionen fácilmente inventarios, pedidos y tallas de calzado, asegurando que sus clientes encuentren el ajuste perfecto.
          </p>
        </Col>
        <Col>
          <Image src='https://i.pinimg.com/564x/a0/40/60/a04060af582a458954e643418eed9284.jpg' rounded fluid />
        </Col>
      </Row>
      <Footer />
    </Container>
  );
}
