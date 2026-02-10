import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { MegaphoneFill } from 'react-bootstrap-icons';

const BroadcastModal = ({ show, onHide, eventId, eventTitle }) => {
    // 1. Dynamic Subject: Updates when the selected event changes
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (show) {
            setSubject(`Important Update: ${eventTitle || 'Event'}`);
            setMessage(""); // Clear message when opening for a new event
        }
    }, [show, eventTitle]);

    const handleSend = async () => {
        // 2. Validation: Don't send empty broadcasts
        if (!message.trim()) {
            alert("Please type a message before sending.");
            return;
        }

        setLoading(true);
        try {
            await axios.post(`http://localhost:8080/api/bookings/admin/broadcast/${eventId}`, {
                subject,
                message
            });
            alert("✅ Broadcast sent successfully to all guests!");
            onHide();
        } catch (err) {
            console.error(err);
            alert("❌ Error sending broadcast. Please check backend connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton className="bg-light">
                <Modal.Title className="fs-5 fw-bold">
                    <MegaphoneFill className="me-2 text-primary" /> 
                    Broadcast to Guests
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <small className="text-muted text-uppercase fw-bold">Target Event:</small>
                    <div className="fw-bold text-dark">{eventTitle}</div>
                </div>
                
                <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Email Subject</Form.Label>
                    <Form.Control 
                        type="text"
                        value={subject} 
                        onChange={(e) => setSubject(e.target.value)} 
                        placeholder="Enter email subject"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Message Content</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={5} 
                        placeholder="Type the message you want to send to all ticket holders..." 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)} 
                    />
                </Form.Group>
                
                <small className="text-info">
                    * This message will be sent to all confirmed attendees via email.
                </small>
            </Modal.Body>
            <Modal.Footer className="border-0">
                <Button variant="outline-secondary" onClick={onHide} disabled={loading}>
                    Cancel
                </Button>
                <Button 
                    variant="primary" 
                    onClick={handleSend} 
                    disabled={loading}
                    className="px-4 rounded-pill"
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Sending...
                        </>
                    ) : (
                        "Send Announcement"
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default BroadcastModal;