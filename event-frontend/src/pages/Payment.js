import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, ShieldCheck, Lock, ArrowLeft, BagCheck } from 'react-bootstrap-icons';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { event } = location.state || {};

    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: '',
        expiry: '',
        cvv: '',
        name: ''
    });

    // Scroll to top on load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handlePayment = async (e) => {
        e.preventDefault();
        
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) {
            alert("Session expired. Please login again.");
            navigate('/login');
            return;
        }

        setIsProcessing(true);

        try {
            // 1. Simulate Payment Gateway Latency (Visual Polish)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 2. Call your Spring Boot Backend
            // Matching your endpoint: /api/bookings/book?userId=...&eventId=...
            await axios.post(`http://localhost:8080/api/bookings/book?userId=${user.id}&eventId=${event.id}`);

            alert("🎉 Success! Your ticket has been booked.");
            navigate('/dashboard'); // Or '/my-bookings'
        } catch (error) {
            console.error("Booking failed:", error);
            const errorMsg = error.response?.data || "Payment processed, but seat reservation failed. Please contact support.";
            alert(errorMsg);
        } finally {
            setIsProcessing(false);
        }
    };

    // Error State: No event data passed
    if (!event) return (
        <div className="container mt-5 py-5 text-center">
            <div className="alert alert-warning d-inline-block px-5 rounded-4">
                <h4 className="alert-heading">No Booking Session Found</h4>
                <p>Please select an event from the home page to start a booking.</p>
                <button className="btn btn-warning rounded-pill mt-2" onClick={() => navigate('/')}>Browse Events</button>
            </div>
        </div>
    );

    return (
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-lg-10 col-xl-8">
                    {/* Back Button */}
                    <button className="btn btn-link text-dark mb-4 p-0 text-decoration-none fw-bold" onClick={() => navigate(-1)}>
                        <ArrowLeft className="me-2" /> Back to Details
                    </button>

                    <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                        <div className="row g-0">
                            
                            {/* Left Side: Order Summary */}
                            <div className="col-md-5 bg-light p-4 p-lg-5">
                                <h5 className="fw-bold mb-4">Order Summary</h5>
                                <div className="d-flex align-items-center mb-4">
                                    <img 
                                        src={`https://picsum.photos/seed/${event.id}/200/200`} 
                                        className="rounded-3 shadow-sm me-3" 
                                        alt="event" 
                                        style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                                    />
                                    <div className="overflow-hidden">
                                        <h6 className="mb-1 fw-bold text-truncate">{event.title}</h6>
                                        <small className="text-muted d-block text-truncate">{event.location}</small>
                                    </div>
                                </div>
                                
                                <div className="py-3 border-top border-bottom">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Ticket Price</span>
                                        <span className="fw-bold">${event.price}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-0">
                                        <span className="text-muted">Booking Fee</span>
                                        <span className="text-success fw-bold">FREE</span>
                                    </div>
                                </div>
                                
                                <div className="d-flex justify-content-between mt-3">
                                    <span className="h5 fw-bold">Total Amount</span>
                                    <span className="h4 fw-bold text-primary">${event.price}</span>
                                </div>
                            </div>

                            {/* Right Side: Secure Form */}
                            <div className="col-md-7 p-4 p-lg-5 bg-white">
                                <div className="d-flex align-items-center mb-4">
                                    <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3">
                                        <Lock className="text-primary" size={24} />
                                    </div>
                                    <h5 className="fw-bold mb-0">Secure Checkout</h5>
                                </div>

                                <form onSubmit={handlePayment}>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted">CARDHOLDER NAME</label>
                                        <input 
                                            type="text" 
                                            className="form-control form-control-lg rounded-3 fs-6" 
                                            placeholder="John Doe" 
                                            required
                                            onChange={e => setPaymentDetails({ ...paymentDetails, name: e.target.value })} 
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted">CARD NUMBER</label>
                                        <div className="input-group input-group-lg">
                                            <span className="input-group-text bg-white border-end-0 text-muted"><CreditCard /></span>
                                            <input 
                                                type="text" 
                                                className="form-control border-start-0 rounded-end-3 fs-6"
                                                placeholder="xxxx xxxx xxxx xxxx" 
                                                required
                                                onChange={e => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })} 
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-6 mb-4">
                                            <label className="form-label small fw-bold text-muted">EXPIRY DATE</label>
                                            <input 
                                                type="text" 
                                                className="form-control form-control-lg rounded-3 fs-6" 
                                                placeholder="MM/YY" 
                                                required
                                                onChange={e => setPaymentDetails({ ...paymentDetails, expiry: e.target.value })} 
                                            />
                                        </div>
                                        <div className="col-6 mb-4">
                                            <label className="form-label small fw-bold text-muted">CVV</label>
                                            <input 
                                                type="password" 
                                                className="form-control form-control-lg rounded-3 fs-6" 
                                                placeholder="***" 
                                                maxLength="3"
                                                required
                                                onChange={e => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })} 
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg w-100 py-3 fw-bold rounded-pill shadow-sm mt-2 transition-all"
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Verifying...
                                            </>
                                        ) : (
                                            <><BagCheck className="me-2" /> Pay ${event.price}</>
                                        )}
                                    </button>
                                </form>

                                <div className="text-center mt-4">
                                    <div className="badge bg-success bg-opacity-10 text-success p-2 px-3 rounded-pill small">
                                        <ShieldCheck className="me-1" /> Payment Data is Encrypted
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;