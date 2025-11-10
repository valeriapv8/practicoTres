import React, { useState } from 'react';
import { Button, Card, Col, Container, Form, FormControl, FormGroup, Row } from "react-bootstrap";
import RequiredLabel from "../../../components/RequiredLabel";
import Header from "../../../components/Header";
import { useNavigate, useParams } from 'react-router-dom';
import { addParticipanteByLink } from '../../../../services/ParticipanteService';

const FormInscripcion = () => {
    const { link } = useParams();
    const navigate = useNavigate();
    const [nombre, setNombre] = useState('');
    const [validated, setValidated] = useState(false);
    const [codigoGenerado, setCodigoGenerado] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        }

        setValidated(true);

        try {
            // Enviar sólo el nombre; no se envía ni procesa contraseña
            const payload = { nombre };
            const res = await addParticipanteByLink(link, payload);
            const token = res?.identificadorUnico || res?.token || res?.linkParticipante || res?.id;
            setCodigoGenerado(token);

            // Redirigir al listado del sorteo (página principal del sorteo)
            if (link) {
                navigate(`/sorteo/${link}`);
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err?.message || 'Error al inscribirse');
        }
    };

    const handleCancel = () => {
        // Lógica para manejar la cancelación, si es necesario
        navigate('/');
    };

    return (
        <>
            <Header />
            <Container>
                <Row className="mt-2">
                    <Col md={6} xl={4}>
                        <Card>
                            <Card.Body>
                                {codigoGenerado ? (
                                    <>
                                        <h2>¡Inscripción exitosa!</h2>
                                        <p>Tu código de acceso es:</p>
                                        <h3 className="text-primary text-center my-4">{codigoGenerado}</h3>
                                        <p className="text-muted">Guarda este código para poder ver tu asignación más tarde.</p>
                                        <Button variant="primary" onClick={() => window.location.href = `/sorteo/${link}`}>
                                            Volver al sorteo
                                        </Button>
                                    </>
                                ) : (
                                    <Form noValidate validated={validated} onSubmit={handleSubmit}> 
                                        <Row>
                                            <Col>
                                                <h1>Inscríbete al Sorteo</h1>
                                                <FormGroup>
                                                    <RequiredLabel htmlFor="txtNombre">Nombre</RequiredLabel>
                                                    <FormControl 
                                                        id="txtNombre" 
                                                        required 
                                                        maxLength={100} 
                                                        type="text"
                                                        value={nombre} 
                                                        onChange={(e) => setNombre(e.target.value)} 
                                                    />
                                                    <FormControl.Feedback type="invalid">
                                                        El nombre es obligatorio
                                                    </FormControl.Feedback>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <div className="mt-2">
                                            <Button variant="primary" type="submit">Inscribirse</Button>
                                            <Button variant="secondary" className="ms-2" onClick={handleCancel}> 
                                                Cancelar
                                            </Button>
                                        </div>
                                        {error && <div style={{ color: 'red' }}>{error}</div>}
                                    </Form>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default FormInscripcion;