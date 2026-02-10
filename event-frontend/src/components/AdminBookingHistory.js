import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { People, TicketPerforated, CashStack } from 'react-bootstrap-icons';

const AdminBookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState({ totalTickets: 0, totalRevenue: 0 });

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/bookings/all");
            setBookings(res.data);
            
            // Calculate basic stats
            const revenue = res.data.reduce((acc, curr) => acc + (curr.event?.price || 0), 0);
            setStats({ totalTickets: res.data.length, totalRevenue: revenue });
        } catch (err) {
            console.error("Error fetching history", err);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="fw-bold mb-4">Master Booking Ledger</h2>

            {/* Quick Stats Summary */}
            <div className="row mb-4 g-3">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm bg-primary text-white p-3 rounded-4">
                        <div className="d-flex justify-content-between">
                            <div><p className="mb-0 small opacity-75">Tickets Sold</p><h3 className="fw-bold">{stats.totalTickets}</h3></div>
                            <TicketPerforated size={30} />
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm bg-success text-white p-3 rounded-4">
                        <div className="d-flex justify-content-between">
                            <div><p className="mb-0 small opacity-75">Total Revenue</p><h3 className="fw-bold">${stats.totalRevenue}</h3></div>
                            <CashStack size={30} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4">Ticket Code</th>
                                <th>Event</th>
                                <th>Customer</th>
                                <th>Price</th>
                                <th>Date</th>
                                <th className="pe-4 text-end">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td className="ps-4 fw-bold text-primary small">{booking.ticketCode}</td>
                                    <td>{booking.event?.title}</td>
                                    <td>
                                        <div className="small fw-bold">{booking.user?.name}</div>
                                        <div className="text-muted extra-small">{booking.user?.email}</div>
                                    </td>
                                    <td>${booking.event?.price || 0}</td>
                                    <td className="small">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                                    <td className="pe-4 text-end">
                                        <span className="badge bg-success-subtle text-success rounded-pill px-3">
                                            {booking.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminBookingHistory;