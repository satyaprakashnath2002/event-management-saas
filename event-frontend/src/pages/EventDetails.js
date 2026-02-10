import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EventService from '../services/EventService';
import { Calendar, GeoAlt, Cash, People, ArrowLeft, Share, InfoCircle } from 'react-bootstrap-icons';

const EventDetails = () => {
    const { id } = useParams(); 
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Scroll to top when page loads
        window.scrollTo(0, 0);
        
        EventService.getEventById(id)
            .then(res => {
                setEvent(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching event:", err);
                setLoading(false);
            });
    }, [id]);

    const handleBooking = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert("Please login to book a ticket");
            navigate('/login');
            return;
        }
        // Navigate to Payment page with event data
        navigate('/payment', { state: { event: event } });
    };

    if (loading) return (
        <div className="container mt-5 py-5 text-center">
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted fw-bold">Loading Event Details...</p>
        </div>
    );

    if (!event) return (
        <div className="container mt-5 text-center py-5">
            <InfoCircle size={50} className="text-muted mb-3" />
            <h3>Oops! Event not found.</h3>
            <button className="btn btn-primary mt-3 rounded-pill" onClick={() => navigate('/')}>Return Home</button>
        </div>
    );

    const available = event.availableSeats || 0;
    const total = event.totalSeats || 100;
    const isSoldOut = available <= 0;
    const progressPercentage = (available / total) * 100;

    return (
        <div className="container mt-4 mb-5">
            {/* Navigation Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <button className="btn btn-outline-dark rounded-pill px-3 py-1 border-0 fw-bold" onClick={() => navigate(-1)}>
                    <ArrowLeft className="me-2" /> Back
                </button>
                <button className="btn btn-light rounded-circle shadow-sm" title="Share Event">
                    <Share />
                </button>
            </div>

            <div className="row g-lg-5">
                {/* Left Column: Media & Content */}
                <div className="col-lg-7">
                    <div className="position-relative">
                        <img 
                            src={`https://picsum.photos/seed/${event.id}/1200/800`} 
                            alt={event.title} 
                            className="img-fluid rounded-4 shadow-sm mb-4" 
                            style={{ objectFit: 'cover', width: '100%', maxHeight: '450px' }}
                        />
                        <span className="position-absolute top-0 start-0 m-3 badge bg-primary px-3 py-2 rounded-pill shadow">
                            {event.category || 'General'}
                        </span>
                    </div>

                    <div className="content-section">
                        <h4 className="fw-bold text-dark border-bottom pb-2">About this Event</h4>
                        <p className="text-muted" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '1.1rem' }}>
                            {event.description || "No description provided for this event."}
                        </p>
                    </div>
                </div>

                {/* Right Column: Sticky Summary Card */}
                <div className="col-lg-5">
                    <div className="card border-0 shadow p-4 rounded-4 sticky-top" style={{ top: '20px', zIndex: '10' }}>
                        <h2 className="fw-bold mb-3">{event.title}</h2>
                        
                        <div className="mb-4">
                            <div className="d-flex align-items-center mb-2">
                                <GeoAlt className="text-primary me-3" size={22} />
                                <span className="text-dark fw-medium">{event.location}</span>
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <Cash className="text-success me-3" size={22} />
                                <span className="h4 mb-0 fw-bold text-success">${event.price}</span>
                            </div>
                        </div>

                        <div className="bg-light p-3 rounded-3 mb-4">
                            <div className="mb-3">
                                <span className="text-muted d-block small mb-1 uppercase fw-bold"><Calendar className="me-2" /> DATE & TIME</span>
                                <p className="mb-0 fw-bold">{new Date(event.startDate).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                                <p className="text-primary small mb-0">{new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            <hr className="my-2 opacity-10" />
                            <div>
                                <span className="text-muted d-block small mb-1 uppercase fw-bold"><People className="me-2" /> CAPACITY</span>
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <span className={`small fw-bold ${isSoldOut ? "text-danger" : "text-success"}`}>
                                        {isSoldOut ? "Sold Out" : `${available} seats remaining`}
                                    </span>
                                    <span className="text-muted small">{total} Total</span>
                                </div>
                                <div className="progress shadow-sm" style={{ height: '10px' }}>
                                    <div 
                                        className={`progress-bar progress-bar-striped progress-bar-animated ${isSoldOut ? 'bg-danger' : 'bg-success'}`} 
                                        role="progressbar" 
                                        style={{ width: `${progressPercentage}%` }}
                                        aria-valuenow={progressPercentage} 
                                        aria-valuemin="0" 
                                        aria-valuemax="100"
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleBooking} 
                            className={`btn btn-lg w-100 rounded-pill py-3 fw-bold transition-all ${isSoldOut ? 'btn-secondary disabled' : 'btn-primary shadow hover-lift'}`}
                            disabled={isSoldOut}
                        >
                            {isSoldOut ? "Fully Booked" : "Book Ticket Now"}
                        </button>
                        
                        <p className="text-center mt-3 text-muted extra-small">
                            * Instant confirmation upon payment
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;