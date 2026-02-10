import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthService from '../services/AuthService';
import { Modal, Button, Container, Row, Col, Badge, Spinner, Nav } from 'react-bootstrap';
import { QRCodeCanvas } from 'qrcode.react'; 
import { 
    TicketPerforated, 
    Calendar3, 
    Map, 
    ArrowRightShort, 
    Stars, 
    Download,
    GeoAltFill,
    PlusLg,
    ClockHistory
} from 'react-bootstrap-icons';
import './UserDashboard.css';

const UserDashboard = () => {
    const [user, setUser] = useState(undefined);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [activeTab, setActiveTab] = useState('active');

    const DEFAULT_EVENT_IMG = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80";
    const ERROR_FALLBACK_IMG = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80";

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
            fetchUserBookings(currentUser.id);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUserBookings = async (userId) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/bookings/user/${userId}`);
            setBookings(res.data);
        } catch (err) { 
            console.error("Error fetching bookings:", err); 
        } finally { 
            setLoading(false); 
        }
    };

    // --- Core Logic: Status & Calendar ---
    const getLiveStatus = (startDate, durationHours = 3) => {
        const now = new Date();
        const eventStart = new Date(startDate);
        const eventEnd = new Date(eventStart.getTime() + durationHours * 60 * 60 * 1000);

        if (now >= eventStart && now <= eventEnd) return 'LIVE';
        if (now > eventEnd) return 'ENDED';
        return 'UPCOMING';
    };

    const addToCalendar = (event) => {
        const startTime = new Date(event.startDate).toISOString().replace(/-|:|\.\d\d\d/g, "");
        const endTime = new Date(new Date(event.startDate).getTime() + 2 * 60 * 60 * 1000)
            .toISOString().replace(/-|:|\.\d\d\d/g, "");
        
        const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startTime}/${endTime}&details=TicketCode: Check Dashboard&location=${encodeURIComponent(event.location)}`;
        window.open(url, '_blank');
    };

    const handleViewPass = (booking) => {
        setSelectedBooking(booking);
        setShowModal(true);
    };

    const openMaps = (location) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
        window.open(url, '_blank');
    };

    // --- Filtering Data ---
    const activePasses = bookings.filter(b => getLiveStatus(b.event?.startDate) !== 'ENDED');
    const pastPasses = bookings.filter(b => getLiveStatus(b.event?.startDate) === 'ENDED');
    const displayedPasses = activeTab === 'active' ? activePasses : pastPasses;

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="grow" variant="primary" />
            </Container>
        );
    }

    return (
        <Container className="py-5 dashboard-fade-in">
            {/* --- Hero Section --- */}
            <div className="user-hero-section mb-5 p-4 p-md-5 rounded-5 shadow-lg text-white">
                <Row className="align-items-center">
                    <Col md={8}>
                        <Badge bg="light" text="dark" className="mb-3 px-3 py-2 rounded-pill shadow-sm">
                            <Stars className="me-2 text-warning" />Member Since 2024
                        </Badge>
                        <h1 className="display-5 fw-bold mb-2">Hello, {user?.name || 'Explorer'}!</h1>
                        <p className="lead opacity-75">You have {activePasses.length} upcoming experiences.</p>
                    </Col>
                    <Col md={4} className="text-md-end d-none d-md-block">
                        <div className="stats-circle shadow-lg">
                            <span className="h2 fw-bold mb-0">{activePasses.length}</span>
                            <small className="d-block opacity-75">Active</small>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* --- Tab Navigation --- */}
            <Nav variant="pills" className="dashboard-tabs mb-4 bg-light p-1 rounded-pill d-inline-flex">
                <Nav.Item>
                    <Nav.Link 
                        active={activeTab === 'active'} 
                        onClick={() => setActiveTab('active')}
                        className="rounded-pill px-4 fw-bold"
                    >
                        Upcoming Passes
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link 
                        active={activeTab === 'past'} 
                        onClick={() => setActiveTab('past')}
                        className="rounded-pill px-4 fw-bold"
                    >
                        Past Experiences
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            {displayedPasses.length === 0 ? (
                <div className="empty-state text-center py-5 bg-light rounded-5 border border-dashed">
                    {activeTab === 'active' ? <TicketPerforated size={50} className="text-muted mb-3" /> : <ClockHistory size={50} className="text-muted mb-3" />}
                    <h4>No {activeTab} tickets found</h4>
                    <p className="text-muted">Explore events to fill your dashboard!</p>
                    <Button variant="primary" href="/events" className="rounded-pill px-4 shadow-sm">Browse Events</Button>
                </div>
            ) : (
                <Row className="g-4">
                    {displayedPasses.map((booking) => {
                        const status = getLiveStatus(booking.event?.startDate);
                        const isLive = status === 'LIVE';

                        return (
                            <Col lg={6} key={booking.id}>
                                <div className={`premium-ticket h-100 shadow-sm ${isLive ? 'live-border' : ''} ${status === 'ENDED' ? 'grayscale' : ''}`} onClick={() => handleViewPass(booking)}>
                                    <div className="ticket-visual-side">
                                        <img 
                                            src={booking.event?.imageUrl || DEFAULT_EVENT_IMG} 
                                            alt={booking.event?.title}
                                            onError={(e) => { e.target.src = ERROR_FALLBACK_IMG; }}
                                        />
                                        <div className="image-overlay"></div>
                                        <div className="ticket-badge-overlay">
                                            <Badge className="bg-glass backdrop-blur">
                                                {booking.event?.category || 'Event'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="ticket-info-side p-4">
                                        <div className="d-flex justify-content-between mb-2">
                                            <div className={`status-pill ${status.toLowerCase()} ${booking.status === 'CHECKED_IN' ? 'used' : ''}`}>
                                                {isLive && <span className="pulse-dot"></span>}
                                                {booking.status === 'CHECKED_IN' ? 'ATTENDED' : status}
                                            </div>
                                            <span className="small text-muted fw-mono">#{booking.ticketCode}</span>
                                        </div>
                                        <h4 className="fw-bold text-dark-800 mb-3 text-truncate-2">{booking.event?.title}</h4>
                                        
                                        <div className="info-grid mb-4">
                                            <div className="info-item d-flex align-items-center mb-2">
                                                <Calendar3 className="text-primary me-2" />
                                                <span className="small">{new Date(booking.event?.startDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                            </div>
                                            <div className="info-item d-flex align-items-center">
                                                <Map className="text-primary me-2" />
                                                <span className="text-truncate small">{booking.event?.location}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="d-flex align-items-center justify-content-between mt-auto">
                                            <Button variant="link" className="p-0 text-decoration-none view-pass-link small" onClick={(e) => {e.stopPropagation(); handleViewPass(booking);}}>
                                                View Pass <ArrowRightShort size={24} />
                                            </Button>
                                            <div className="d-flex gap-2">
                                                {status !== 'ENDED' && (
                                                    <Button variant="outline-dark" size="sm" className="rounded-pill px-3" onClick={(e) => {e.stopPropagation(); addToCalendar(booking.event);}}>
                                                        <PlusLg className="me-1"/> Calendar
                                                    </Button>
                                                )}
                                                <Button variant="outline-primary" size="sm" className="rounded-pill px-3" onClick={(e) => {e.stopPropagation(); openMaps(booking.event?.location);}}>
                                                    <GeoAltFill className="me-1"/> Maps
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        );
                    })}
                </Row>
            )}

            {/* --- Modal Pass --- */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered className="wallet-modal">
                <Modal.Body className="p-0 overflow-hidden rounded-5 shadow-2xl">
                    <div className="wallet-pass-bg p-4 text-center">
                        <div className="pass-header mb-4">
                            <div className="mx-auto bg-white p-3 rounded-4 shadow-lg d-inline-block mt-3">
                                <QRCodeCanvas value={selectedBooking?.ticketCode || "VOID"} size={180} />
                            </div>
                        </div>
                        <div className="pass-body bg-white p-4 rounded-top-5 text-start">
                            <h3 className="fw-bold mb-1 text-center">{selectedBooking?.event?.title}</h3>
                            <p className="text-muted small mb-4 text-center">Scan at the venue gate for entry</p>
                            
                            <Row className="g-3 border-top pt-4">
                                <Col xs={6}>
                                    <small className="text-muted d-block text-uppercase ls-1">Attendee</small>
                                    <span className="fw-bold">{user?.name}</span>
                                </Col>
                                <Col xs={6}>
                                    <small className="text-muted d-block text-uppercase ls-1">Pass ID</small>
                                    <span className="fw-bold text-primary">#{selectedBooking?.ticketCode}</span>
                                </Col>
                            </Row>
                            <Button variant="dark" className="w-100 rounded-pill py-3 mt-4 fw-bold shadow" onClick={() => window.print()}>
                                <Download className="me-2" /> Download PDF Ticket
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default UserDashboard;