import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TicketPerforated, CalendarEvent, GeoAlt, Hash, Download, CheckCircleFill, Clock, EmojiSmile } from 'react-bootstrap-icons';

const Dashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        axios.get(`http://localhost:8080/api/bookings/user/${user.id}`)
            .then(res => {
                setBookings(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setLoading(false);
            });
    }, [user?.id, navigate]);

    // --- PDF GENERATION LOGIC ---
    const downloadTicket = async (bookingId, eventName) => {
        // STEP 1: If you don't see this alert, the button click is blocked!
        window.alert("Click detected! Starting PDF generation for " + eventName);
        console.log("Processing ticket ID:", bookingId);

        const element = document.getElementById(`ticket-${bookingId}`);
        if (!element) {
            window.alert("Error: Cannot find HTML element ticket-" + bookingId);
            return;
        }

        try {
            // Hide button
            const btn = element.querySelector('.dl-btn');
            if (btn) btn.style.visibility = 'hidden';

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: true
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = (canvas.height * pageWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 10, pageWidth, pageHeight);
            pdf.save(`Ticket_${bookingId}.pdf`);

            if (btn) btn.style.visibility = 'visible';
            window.alert("Download Complete!");

        } catch (error) {
            console.error("PDF Error:", error);
            window.alert("System Error: " + error.message);
        }
    };

    if (loading) return <div className="text-center mt-5">Loading...</div>;

    return (
        <div className="container mt-5">
            <h2 className="fw-bold mb-4">My Dashboard</h2>
            <div className="row g-4">
                {bookings.map((booking) => (
                    <div className="col-md-6 col-lg-4" key={booking.id}>
                        {/* THE ID MUST MATCH EXACTLY */}
                        <div 
                            className="card shadow-sm border-0 position-relative" 
                            id={`ticket-${booking.id}`} 
                            style={{ borderRadius: '15px', overflow: 'hidden', background: '#fff' }}
                        >
                            <div className="bg-primary p-3 text-white d-flex justify-content-between">
                                <span className="fw-bold small">OFFICIAL TICKET</span>
                                <Hash />
                            </div>
                            <div className="card-body p-4">
                                <h5 className="fw-bold text-dark mb-3">{booking.event?.title || "Event Name"}</h5>
                                <div className="small text-muted mb-2">
                                    <CalendarEvent className="me-2 text-primary" />
                                    {booking.event?.startDate ? new Date(booking.event.startDate).toLocaleDateString() : 'N/A'}
                                </div>
                                <div className="small text-muted mb-4">
                                    <GeoAlt className="me-2 text-primary" />
                                    {booking.event?.location || "Venue TBD"}
                                </div>
                                <div className="d-flex justify-content-between align-items-center border-top pt-3">
                                    <div className="font-monospace fw-bold text-primary">{booking.ticketCode}</div>
                                    <button 
                                        type="button"
                                        className="btn btn-dark btn-sm rounded-pill px-3 dl-btn"
                                        style={{ zIndex: 10, position: 'relative' }} // Ensures it is "on top"
                                        onClick={() => downloadTicket(booking.id, booking.event?.title || "Event")}
                                    >
                                        <Download className="me-1" /> Get PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;