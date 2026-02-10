import React, { useState } from 'react';
import axios from 'axios';
import { PlusCircle, Image, GeoAlt, Calendar3, CashStack, People, CheckCircle } from 'react-bootstrap-icons';

const AddEvent = () => {
    const [eventData, setEventData] = useState({
        title: '',
        description: '',
        location: '',
        startDate: '',
        price: '',
        totalSeats: '',
        imageUrl: '',
        category: 'Music' // Default category
    });

    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/events/add', eventData);
            setMessage({ type: 'success', text: '🎉 Event created successfully!' });
            setEventData({ title: '', description: '', location: '', startDate: '', price: '', totalSeats: '', imageUrl: '', category: 'Music' });
        } catch (err) {
            setMessage({ type: 'danger', text: '❌ Failed to create event. Check backend connection.' });
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5">
                        <div className="text-center mb-4">
                            <PlusCircle size={40} className="text-primary mb-2" />
                            <h2 className="fw-bold">Create New Event</h2>
                            <p className="text-muted">Fill in the details to launch your next experience</p>
                        </div>

                        {message.text && (
                            <div className={`alert alert-${message.type} rounded-4 animate__animated animate__fadeIn`}>
                                {message.type === 'success' ? <CheckCircle className="me-2" /> : null}
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-md-12">
                                    <label className="form-label fw-bold small">Event Title</label>
                                    <input type="text" name="title" className="form-control rounded-pill" placeholder="e.g. Summer Music Festival" value={eventData.title} onChange={handleChange} required />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold small"><Calendar3 className="me-1" /> Date & Time</label>
                                    <input type="datetime-local" name="startDate" className="form-control rounded-pill" value={eventData.startDate} onChange={handleChange} required />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold small"><GeoAlt className="me-1" /> Location</label>
                                    <input type="text" name="location" className="form-control rounded-pill" placeholder="Venue Name, City" value={eventData.location} onChange={handleChange} required />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold small"><CashStack className="me-1" /> Ticket Price ($)</label>
                                    <input type="number" name="price" className="form-control rounded-pill" placeholder="0.00" value={eventData.price} onChange={handleChange} required />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold small"><People className="me-1" /> Total Capacity</label>
                                    <input type="number" name="totalSeats" className="form-control rounded-pill" placeholder="e.g. 500" value={eventData.totalSeats} onChange={handleChange} required />
                                </div>

                                <div className="col-md-12">
                                    <label className="form-label fw-bold small"><Image className="me-1" /> Image URL</label>
                                    <input type="url" name="imageUrl" className="form-control rounded-pill" placeholder="https://example.com/image.jpg" value={eventData.imageUrl} onChange={handleChange} required />
                                </div>

                                <div className="col-md-12">
                                    <label className="form-label fw-bold small">Description</label>
                                    <textarea name="description" className="form-control rounded-4" rows="3" placeholder="Tell people about your event..." value={eventData.description} onChange={handleChange} required></textarea>
                                </div>

                                <div className="col-12 mt-4">
                                    <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill fw-bold shadow-sm">
                                        Publish Event
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEvent;