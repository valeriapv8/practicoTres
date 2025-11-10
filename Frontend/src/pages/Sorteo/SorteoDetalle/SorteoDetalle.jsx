import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button, ListGroup, Spinner, Alert, Stack, Badge, Modal, Form } from "react-bootstrap";
import Header from "../../../components/Header";
import { getSorteoByLink } from "../../../../services/SorteoService";
import { useSorteoDetalle } from "./SorteoDetalle";

const DetalleSorteo = () => {
    const { link } = useParams();
    const navigate = useNavigate();

    const [sorteo, setSorteo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const {
        username,
        shareLink,
        handleCopyLink,
        showShare,
        setShowShare,
        copied,
        handleHabilitar,
        handleDeshabilitar,
        handleSortear,
        participanteData
    } = useSorteoDetalle();

    const isOwner = (username !== "");

    useEffect(() => {
        console.log("SorteoDetalle params:", { link });
        if (!link) {
            setLoading(false);
            setError(new Error("Parámetro 'link' ausente en la URL"));
            return;
        }

        setLoading(true);
        setError(null);

        getSorteoByLink(link)
            .then((data) => setSorteo(data))
            .catch((err) => {
                console.error("Error al cargar el sorteo:", err);
                setError(err);
                setSorteo(null);
            })
            .finally(() => setLoading(false));
    }, [link]);

    const formatearFecha = (fechaISO) => {
        if (!fechaISO) return "Fecha no definida";
        const fecha = new Date(fechaISO);
        return fecha.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const renderContent = () => {
        if (loading) {
            return (
                <Col className="text-center mt-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                </Col>
            );
        }

        if (error) {
            return (
                <Col>
                    <Alert variant="danger">
                        <strong>Error:</strong> {error.message ?? "Error"}
                    </Alert>
                </Col>
            );
        }

        if (!sorteo) {
            return null;
        }

        const fecha = formatearFecha(sorteo.fecha);
        const creador = sorteo.usuario;

        // Vista para NO propietarios
        if (!isOwner) {
            return (
                <>
                    <Col md={5} lg={4}>
                        <Card className="shadow-sm mb-3">
                            <Card.Body>
                                <Card.Title as="h3">{sorteo.nombre}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    Creado por: {creador}
                                </Card.Subtitle>
                                <hr />
                                <p><strong>Fecha:</strong> {fecha}</p>

                                <Stack gap={2} className="mt-4">
                                    <Button variant="primary" onClick={() => navigate(`/sorteo/${link}/inscribirme`)}>
                                        Inscribirse al sorteo
                                    </Button>

                                    {/* Nuevo comportamiento: ir directo a la asignación sin pedir código */}
                                    <Button variant="outline-primary" onClick={() => {
                                        // intentar obtener token/identificador en orden: participanteData -> localStorage
                                        const token =
                                            participanteData?.linkParticipante ||
                                            participanteData?.identificadorUnico ||
                                            localStorage.getItem('participanteToken') ||
                                            localStorage.getItem('token') ||
                                            null;
                                        if (token) {
                                            navigate(`/participantes/${token}`);
                                        } else {
                                            // si no hay token disponible, llevar a la inscripción del sorteo
                                            navigate(`/sorteo/${link}`);
                                        }
                                    }}>
                                        Ver mi asignación
                                    </Button>
                                </Stack>

                                {participanteData && (
                                    <Card className="mt-3 shadow-sm">
                                        <Card.Body>
                                            <h5>Tu asignación:</h5>
                                            {participanteData.participanteAsignado ? (
                                                <>
                                                    <p className="mb-1"><strong>{participanteData.participanteAsignado.nombre}</strong></p>
                                                    {participanteData.participanteAsignado.deseos?.length > 0 && (
                                                        <div className="mt-2">
                                                            <small className="text-muted">Lista de deseos:</small>
                                                            <ul className="mt-1">
                                                                {participanteData.participanteAsignado.deseos.map((d, i) => (
                                                                    <li key={i}><small>{d.wishlist}</small></li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <p className="text-muted">Aún no se ha realizado el sorteo.</p>
                                            )}
                                            <div>Ver detalles <a href={`/participantes/${participanteData.linkParticipante}`} target="_blank" rel="noopener noreferrer">aquí</a></div>
                                        </Card.Body>
                                    </Card>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={7} lg={8}>
                        <Card className="shadow-sm">
                            <Card.Header as="h5">
                                Participantes ({sorteo.participantes?.length || 0})
                            </Card.Header>
                            <ListGroup variant="flush" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                {!sorteo.participantes || sorteo.participantes.length === 0 ? (
                                    <ListGroup.Item>
                                        Todavía no hay participantes inscritos.
                                    </ListGroup.Item>
                                ) : (
                                    // hacer cada participante clickeable y llevar directo a sus deseos
                                    sorteo.participantes.map((participante) => {
                                        const token = participante.identificadorUnico || participante.linkParticipante || participante.token || participante.id;
                                        return (
                                            <ListGroup.Item key={participante.id || token}>
                                                <Link to={`/participantes/${token}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                    <small>{participante.nombre || 'Nombre no registrado'}</small>
                                                </Link>
                                            </ListGroup.Item>
                                        );
                                    })
                                )}
                            </ListGroup>
                        </Card>
                    </Col>
                </>
            );
        }

        // Vista para propietarios
        let estadoVariant = "secondary";
        if (sorteo.estado == true) estadoVariant = "success";
        if (sorteo.estado == false) estadoVariant = "primary";

        return (
            <>
                <Col md={5} lg={4}>
                    <Card className="shadow-sm mb-3">
                        <Card.Body>
                            <Card.Title as="h3">{sorteo.nombre}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                                Creado por: {creador}
                            </Card.Subtitle>
                            <hr />
                            <p>
                                <strong>Estado:</strong> <Badge bg={estadoVariant} pill>{sorteo.estado}</Badge>
                            </p>
                            <p>
                                <strong>Fecha:</strong> {fecha}
                            </p>
                            <p>
                                
                                <strong>Link de invitación:</strong> <br />
                                <code className="text-break">{`${window.location.origin}/sorteo/${sorteo.link}`}</code>
                                
                            </p>

                            <h5 className="mt-4">Acciones de Administrador</h5>
                            <Stack gap={2}>
                                <Button variant="secondary" onClick={shareLink}>
                                    Compartir sorteo
                                </Button>

                                {sorteo.estado === true ? (
                                    <Button variant="warning" onClick={handleDeshabilitar}>
                                        Deshabilitar Sorteo
                                    </Button>
                                ) : (
                                    <Button variant="success" onClick={handleHabilitar} disabled={sorteo.estado === 'finalizado'}>
                                        Habilitar Sorteo
                                    </Button>
                                )}

                                <Button
                                    variant="primary"
                                    onClick={handleSortear}
                                    disabled={sorteo.estado == false}
                                >
                                    Realizar Sorteo
                                </Button>
                            </Stack>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={7} lg={8}>
                    <Card className="shadow-sm">
                        <Card.Header as="h5">
                            Participantes ({sorteo.participantes?.length || 0})
                        </Card.Header>
                        <ListGroup variant="flush" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                            {!sorteo.participantes || sorteo.participantes.length === 0 ? (
                                <ListGroup.Item>
                                    Todavía no hay participantes inscritos.
                                </ListGroup.Item>
                            ) : (
                                sorteo.participantes.map((participante) => {
                                    const token = participante.identificadorUnico || participante.linkParticipante || participante.token || participante.id;
                                    return (
                                        <ListGroup.Item key={participante.id || token}>
                                            <Link to={`/participantes/${token}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                <small>{participante.nombre || 'Nombre no registrado'}</small>
                                            </Link>
                                        </ListGroup.Item>
                                    );
                                })
                            )}
                        </ListGroup>
                    </Card>
                </Col>
            </>
        );
    };

    return (
        <>
            <Header />
            <Container className="my-4">
                {isOwner && (
                    <Row className="mb-3">
                        <Col>
                            <Button variant="outline-secondary" onClick={() => navigate('/')}>
                                &larr; Volver a Mis Sorteos
                            </Button>
                        </Col>
                    </Row>
                )}
                <Row>
                    {renderContent()}
                </Row>

                {/* Modal de compartir */}
                <Modal show={showShare} onHide={() => setShowShare(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Compartir Sorteo</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Link de invitación</Form.Label>
                            <Form.Control readOnly value={sorteo ? `${window.location.origin}/sorteo/${sorteo.link}` : ""} />
                        </Form.Group>
                        <div className="mt-3 d-flex justify-content-end">
                            <Button variant="primary" onClick={handleCopyLink}>
                                {copied ? "✓ Copiado" : "Copiar link"}
                            </Button>
                        </div>
                    </Modal.Body>
                </Modal>
            </Container>
        </>
    );
};

export default DetalleSorteo;