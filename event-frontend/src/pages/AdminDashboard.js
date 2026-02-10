import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Speedometer2,
    PlusCircle,
    Trash,
    PeopleFill,
    MegaphoneFill,
    PencilSquare,
    Wallet2,
    TicketPerforated,
    PersonCheck
} from 'react-bootstrap-icons';
import GuestListModal from '../components/GuestListModal';
import BroadcastModal from '../components/BroadcastModal';
import EditEventModal from '../components/EditEventModal';

const AdminDashboard = () => {
    const [events, setEvents] = useState([]);
    const [stats, setStats] = useState({ totalBookings: 0, totalRevenue: 0, checkedIn: 0 });
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showGuestList, setShowGuestList] = useState(false);
    const [showBroadcast, setShowBroadcast] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [formData, setFormData] = useState({
        title: '', description: '', location: '',
        category: 'Music', startDate: '', totalSeats: '',
        price: '', imageUrl: ''
    });

    useEffect(() => { loadDashboardData(); }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/events');
            const eventData = Array.isArray(response.data) ? response.data : response.data.content || [];
            setEvents(eventData);

            const statsRes = await axios.get('http://localhost:8080/api/bookings/admin/stats')
                .catch(() => ({ data: { totalBookings: 0, totalRevenue: 0, checkedIn: 0 } }));
            setStats(statsRes.data);
        } catch (err) {
            console.error("Dashboard Load Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('⚠️ Permanent Delete? This cannot be undone.')) return;
        try {
            await axios.delete(`http://localhost:8080/api/events/${id}`);
            loadDashboardData();
        } catch (err) { alert('Error deleting event.'); }
    };

    return (
        <div className="container-fluid py-4 px-md-5 bg-light min-vh-100">
            {/* --- HEADER --- */}
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="fw-bold text-dark mb-1">
                        <Speedometer2 className="me-2 text-primary" /> Management Hub
                    </h2>
                    <p className="text-muted mb-0">Monitor your events and analyze booking performance.</p>
                </div>
                <div className="text-end d-none d-md-block">
                    <span className="badge bg-white text-dark shadow-sm border p-2 px-3 rounded-pill">
                        System Status: <span className="text-success">● Active</span>
                    </span>
                </div>
            </div>

            {/* --- STATISTICS CARDS --- */}
            <div className="row g-4 mb-5">
                <StatCard title="Revenue" value={`$${stats.totalRevenue}`} icon={<Wallet2 />} color="primary" />
                <StatCard title="Total Tickets" value={stats.totalBookings} icon={<TicketPerforated />} color="dark" />
                <StatCard title="Checked In" value={stats.checkedIn} icon={<PersonCheck />} color="success" />
            </div>

            <div className="row g-4">
                {/* --- LIVE EVENTS TABLE --- */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="card-header bg-white py-3 border-0">
                            <h5 className="fw-bold mb-0">Active Events</h5>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light text-muted small">
                                    <tr>
                                        <th className="ps-4">EVENT</th>
                                        <th>PRICING</th>
                                        <th className="text-end pe-4">MANAGEMENT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.length > 0 ? (
                                        events.map((event) => (
                                            <tr key={event.id}>
                                                <td className="ps-4 py-3">
                                                    <div className="d-flex align-items-center">
                                                        <img src={event.imageUrl || "https://placehold.co/50x50"} 
                                                             className="rounded-3 shadow-sm me-3" 
                                                             style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                                                             alt="" />
                                                        <div>
                                                            <div className="fw-bold text-dark">{event.title}</div>
                                                            <span className="badge bg-primary-subtle text-primary small px-2 py-1">{event.category}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="fw-bold text-dark">${event.price}</div>
                                                    <div className="small text-muted">{event.totalSeats} seats total</div>
                                                </td>
                                                <td className="text-end pe-4">
                                                    <div className="btn-group shadow-sm rounded-3">
                                                        <button className="btn btn-white btn-sm border" onClick={() => { setSelectedEvent(event); setShowGuestList(true); }} title="Guest List"><PeopleFill /></button>
                                                        <button className="btn btn-white btn-sm border" onClick={() => { setSelectedEvent(event); setShowEditModal(true); }} title="Edit"><PencilSquare className="text-primary" /></button>
                                                        <button className="btn btn-white btn-sm border" onClick={() => { setSelectedEvent(event); setShowBroadcast(true); }} title="Broadcast"><MegaphoneFill className="text-warning" /></button>
                                                        <button className="btn btn-white btn-sm border text-danger" onClick={() => handleDelete(event.id)} title="Delete"><Trash /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="text-center py-5 text-muted">
                                                {loading ? <div className="spinner-border text-primary"></div> : "No active events found."}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* --- QUICK CREATE SIDEBAR --- */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '100px', zIndex: 10 }}>
                        <div className="d-flex align-items-center mb-4">
                            <PlusCircle className="text-primary me-2" size={20} />
                            <h5 className="fw-bold mb-0">Create Event</h5>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); axios.post('http://localhost:8080/api/events', formData).then(loadDashboardData); }}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">EVENT TITLE</label>
                                <input type="text" className="form-control bg-light border-0 py-2" placeholder="e.g. Summer Music Fest" onChange={e => setFormData({...formData, title: e.target.value})} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">TICKET PRICE ($)</label>
                                <input type="number" className="form-control bg-light border-0 py-2" placeholder="0.00" onChange={e => setFormData({...formData, price: e.target.value})} required />
                            </div>
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-muted">CATEGORY</label>
                                <select className="form-select bg-light border-0 py-2" onChange={e => setFormData({...formData, category: e.target.value})}>
                                    <option value="Music">Music</option>
                                    <option value="Tech">Tech</option>
                                    <option value="Workshop">Workshop</option>
                                </select>
                            </div>
                            <button className="btn btn-primary w-100 rounded-3 py-2 fw-bold shadow-sm">
                                Publish Event
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* MODALS */}
            <GuestListModal show={showGuestList} onHide={() => setShowGuestList(false)} eventId={selectedEvent?.id} eventTitle={selectedEvent?.title} />
            <BroadcastModal show={showBroadcast} onHide={() => setShowBroadcast(false)} eventId={selectedEvent?.id} eventTitle={selectedEvent?.title} />
            <EditEventModal show={showEditModal} onHide={() => setShowEditModal(false)} event={selectedEvent} onSuccess={loadDashboardData} />
        </div>
    );
};

// Helper Component for Stats
const StatCard = ({ title, value, icon, color }) => (
    <div className="col-md-4">
        <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <div className="d-flex align-items-center justify-content-between">
                <div>
                    <h6 className="text-muted small fw-bold text-uppercase mb-1">{title}</h6>
                    <h2 className="fw-bold mb-0">{value}</h2>
                </div>
                <div className={`bg-${color} bg-opacity-10 p-3 rounded-4 text-${color}`}>
                    {React.cloneElement(icon, { size: 28 })}
                </div>
            </div>
        </div>
    </div>
);

export default AdminDashboard;