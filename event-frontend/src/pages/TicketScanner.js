import React, { useState } from 'react';
import axios from 'axios';
import { QrCodeScan, Search, CheckCircleFill, XCircleFill, PersonBadge } from 'react-bootstrap-icons';

const TicketScanner = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [booking, setBooking] = useState(null);
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', msg: '' });
        
        try {
            // Adjust this URL to match your Spring Boot search endpoint
            const res = await axios.get(`http://localhost:8080/api/bookings/verify?query=${searchQuery}`);
            setBooking(res.data);
        } catch (err) {
            setBooking(null);
            setStatus({ type: 'danger', msg: 'Invalid Ticket: No booking found.' });
        } finally {
            setLoading(false);
        }
    };

    const performCheckIn = async () => {
        try {
            await axios.patch(`http://localhost:8080/api/bookings/${booking.id}/check-in`);
            setBooking({ ...booking, checkedIn: true });
            setStatus({ type: 'success', msg: 'Entry Granted! Guest has been checked in.' });
        } catch (err) {
            setStatus({ type: 'danger', msg: 'Server error during check-in.' });
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6 text-center">
                    <div className="mb-4">
                        <div className="d-inline-block p-4 bg-primary bg-opacity-10 rounded-circle text-primary mb-3">
                            <QrCodeScan size={40} />
                        </div>
                        <h2 className="fw-bold">Gate Access Control</h2>
                        <p className="text-muted">Scan QR code or enter Booking Reference</p>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="input-group mb-4 shadow-sm rounded-pill overflow-hidden border">
                        <span className="input-group-text bg-white border-0 ps-3"><Search className="text-muted"/></span>
                        <input 
                            type="text" 
                            className="form-control border-0 py-3" 
                            placeholder="Enter Email or Booking ID..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="btn btn-primary px-4 fw-bold" type="submit">Verify</button>
                    </form>

                    {/* Feedback Alert */}
                    {status.msg && (
                        <div className={`alert alert-${status.type} rounded-4 animate__animated animate__fadeIn`}>
                            {status.type === 'success' ? <CheckCircleFill className="me-2"/> : <XCircleFill className="me-2"/>}
                            {status.msg}
                        </div>
                    )}

                    {/* Guest Result Card */}
                    {booking && (
                        <div className="card border-0 shadow-lg rounded-4 p-4 mt-4 animate__animated animate__zoomIn">
                            <div className="d-flex align-items-center justify-content-center mb-3">
                                <div className="bg-light p-3 rounded-circle">
                                    <PersonBadge size={30} className="text-dark" />
                                </div>
                            </div>
                            <h4 className="fw-bold mb-1">{booking.userName}</h4>
                            <p className="badge bg-primary-subtle text-primary mb-3">{booking.eventTitle}</p>
                            
                            <hr className="my-3 opacity-10" />

                            <div className="d-flex justify-content-between mb-4 px-3">
                                <div className="text-start">
                                    <small className="text-muted d-block">STATUS</small>
                                    <span className={`fw-bold ${booking.checkedIn ? 'text-success' : 'text-warning'}`}>
                                        {booking.checkedIn ? 'Already Admitted' : 'Valid Ticket'}
                                    </span>
                                </div>
                                <div className="text-end">
                                    <small className="text-muted d-block">BOOKING ID</small>
                                    <span className="fw-bold">#{booking.id}</span>
                                </div>
                            </div>

                            {!booking.checkedIn ? (
                                <button 
                                    className="btn btn-success btn-lg w-100 rounded-pill fw-bold shadow-sm"
                                    onClick={performCheckIn}
                                >
                                    Confirm Entry
                                </button>
                            ) : (
                                <button className="btn btn-outline-secondary btn-lg w-100 rounded-pill disabled">
                                    Access Already Used
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketScanner;