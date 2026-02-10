import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const EditEventModal = ({ show, onHide, event, onSuccess }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (event) setFormData(event);
    }, [event]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/events/${event.id}`, formData);
            alert("Event updated successfully!");
            onSuccess();
            onHide();
        } catch (err) {
            alert("Error updating event.");
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton className="border-0">
                <Modal.Title className="fw-bold text-primary">Edit Event Details</Modal.Title>
            </Modal.Header>
            <Modal.Body className="px-4">
                <Form onSubmit={handleUpdate}>
                    <div className="row g-3">
                        <div className="col-12">
                            <Form.Label className="small fw-bold">Event Title</Form.Label>
                            <Form.Control name="title" value={formData.title || ''} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <Form.Label className="small fw-bold">Price ($)</Form.Label>
                            <Form.Control type="number" name="price" value={formData.price || ''} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <Form.Label className="small fw-bold">Total Seats</Form.Label>
                            <Form.Control type="number" name="totalSeats" value={formData.totalSeats || ''} onChange={handleChange} required />
                        </div>
                        <div className="col-12">
                            <Form.Label className="small fw-bold">Location</Form.Label>
                            <Form.Control name="location" value={formData.location || ''} onChange={handleChange} required />
                        </div>
                        <div className="col-12">
                            <Form.Label className="small fw-bold">Image URL</Form.Label>
                            <Form.Control name="imageUrl" value={formData.imageUrl || ''} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="mt-4 d-flex gap-2">
                        <Button variant="light" className="w-100 rounded-pill" onClick={onHide}>Cancel</Button>
                        <Button variant="primary" type="submit" className="w-100 rounded-pill fw-bold">Save Changes</Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditEventModal;