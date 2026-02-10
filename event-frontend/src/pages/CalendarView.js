import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import EventService from '../services/EventService';

const CalendarView = () => {
    const [events, setEvents] = useState([]);

    const mockEvents = [
        { title: "Tech Innovation Summit", start: "2026-02-10", backgroundColor: "#0dcaf0" },
        { title: "Global Music Festival", start: "2026-02-15", backgroundColor: "#6610f2" },
        { title: "Startup Pitch Night", start: "2026-02-20", backgroundColor: "#fd7e14" }
    ];

    useEffect(() => {
        EventService.getEvents()
            .then((res) => {
                if (res.data && res.data.length > 0) {
                    // Map backend data to FullCalendar format
                    const formattedEvents = res.data.map(event => ({
                        title: event.title,
                        start: event.startDate || new Date().toISOString().split('T')[0],
                        url: `/events/${event.id}`
                    }));
                    setEvents(formattedEvents);
                } else {
                    setEvents(mockEvents);
                }
            })
            .catch(() => setEvents(mockEvents));
    }, []);

    return (
        <div className="container mt-5 mb-5 shadow-lg p-4 bg-white rounded-4">
            <div className="text-center mb-4">
                <h2 className="fw-bold text-dark">Event Schedule</h2>
                <p className="text-muted">Click on an event to view details</p>
            </div>
            
            <div className="calendar-container px-2">
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth'
                    }}
                    height="auto"
                    eventClick={(info) => {
                        if (info.event.url) {
                            info.jsEvent.preventDefault();
                            window.location.href = info.event.url;
                        }
                    }}
                />
            </div>

            <style>{`
                .fc-header-toolbar { margin-bottom: 2rem !important; }
                .fc-toolbar-title { font-size: 1.5rem !important; font-weight: bold; }
                .fc-button-primary { background-color: #212529 !important; border: none !important; }
                .fc-daygrid-event { cursor: pointer; border-radius: 4px; padding: 2px 5px; }
            `}</style>
        </div>
    );
};

export default CalendarView;