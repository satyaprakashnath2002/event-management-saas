import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Table, Badge, Button } from 'react-bootstrap';
import { CheckCircleFill, XCircle } from 'react-bootstrap-icons';

const GuestListModal = ({ show, onHide, eventId, eventTitle }) => {
    const [attendees, setAttendees] = useState([]);

    useEffect(() => {
        if (show && eventId) {
            fetchAttendees();
        }
    }, [show, eventId]);

    const fetchAttendees = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/bookings/event/${eventId}`);
            setAttendees(res.data);
        } catch (err) {
            console.error("Error fetching attendees", err);
        }
    };

    const toggleCheckIn = async (bookingId) => {
        try {
            await axios.post(`http://localhost:8080/api/bookings/verify/${bookingId}`);
            fetchAttendees(); // Refresh list
        } catch (err) {
            alert("Check-in failed");
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold">Attendees: {eventTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table hover responsive align="middle">
                    <thead>
                        <tr>
                            <th>Guest Name</th>
                            <th>Ticket ID</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendees.map((guest) => (
                            <tr key={guest.id}>
                                <td>{guest.customerName}</td>
                                <td><code className="small">{guest.id}</code></td>
                                <td>
                                    {guest.checkedIn ? 
                                        <Badge bg="success-subtle" className="text-success rounded-pill">Checked In</Badge> : 
                                        <Badge bg="secondary-subtle" className="text-muted rounded-pill">Pending</Badge>
                                    }
                                </td>
                                <td>
                                    {!guest.checkedIn && (
                                        <Button variant="outline-primary" size="sm" onClick={() => toggleCheckIn(guest.id)}>
                                            Manual Check-in
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Modal.Body>
        </Modal>
    );
};

export default GuestListModal;