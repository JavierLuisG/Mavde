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
        <h1>Bienvenido a Mavde</h1>
        <p>
          En Mavde, proporcionamos soluciones para la gestión de clientes y productos, y pronto también de proveedores.
        </p>
      </Container>
      <Row className='mx-4 my-5'>
        <Col>
          <h2>Sobre Nosotros</h2>
          <p>
            Mavde es una empresa dedicada a ayudar a otras empresas a gestionar eficientemente sus clientes y productos. Nuestro objetivo es proporcionar herramientas que faciliten la administración de su negocio.
          </p>
          <p>
            Próximamente, también ofreceremos soluciones para la gestión de proveedores, ampliando así nuestras capacidades para satisfacer todas sus necesidades comerciales.
          </p>
          <p>
            Estamos en constante desarrollo para asegurar que nuestras soluciones sean innovadoras y estén alineadas con las últimas tendencias del mercado.
          </p>
        </Col>
        <Col>
          <Image src='https://i.pinimg.com/564x/2c/47/6f/2c476fca218245cccdf2458e420ff2e7.jpg' rounded fluid />
        </Col>
      </Row>
      <Footer />
    </Container>
  );
}
