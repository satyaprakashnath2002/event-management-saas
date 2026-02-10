import React, { useState, useEffect } from 'react';
import EventService from '../services/EventService';
import { GeoAlt, Search } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

const EventList = ({ searchTerm = "" }) => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    const categories = ["All", "Music", "Tech", "Sports", "Workshops", "Art"];

    useEffect(() => {
        EventService.getEvents()
            .then(res => {
                // Ensure we handle different data formats safely
                const data = Array.isArray(res.data) ? res.data : [];
                setEvents(data);
                setFilteredEvents(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const sTerm = searchTerm.toLowerCase().trim();

        const results = events.filter(event => {
            const title = (event.title || "").toLowerCase();
            const location = (event.location || "").toLowerCase();
            const eventCat = (event.category || "General").toLowerCase().trim();
            const selectedCat = selectedCategory.toLowerCase().trim();

            // ✅ SEARCH MATCH (title OR location)
            const matchesSearch =
                sTerm === "" ||
                title.includes(sTerm) ||
                location.includes(sTerm);

            // ✅ CATEGORY MATCH
            const matchesCategory =
                selectedCategory === "All" ||
                eventCat === selectedCat;

            return matchesSearch && matchesCategory;
        });

        setFilteredEvents(results);
    }, [searchTerm, selectedCategory, events]);

    if (loading) {
        return (
            <div className="text-center mt-5 p-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-4">
            {/* --- FILTER BUTTONS --- */}
            <div className="d-flex justify-content-center flex-wrap gap-2 mb-5">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`btn rounded-pill px-4 fw-bold shadow-sm transition-all ${
                            selectedCategory === cat
                                ? 'btn-primary'
                                : 'btn-outline-secondary'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* --- EVENT CARDS GRID --- */}
            <div className="row g-4">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map(event => (
                        <div className="col-md-4 mb-4" key={event.id}>
                            <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden card-hover">
                                {/* IMAGE WITH FALLBACK LOGIC */}
                                <img
                                    src={event.imageUrl || `https://picsum.photos/seed/${event.id}/600/400`}
                                    className="card-img-top"
                                    alt={event.title}
                                    style={{ height: '220px', objectFit: 'cover' }}
                                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=600"; }}
                                />
                                
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <span className="badge bg-primary-subtle text-primary border rounded-pill px-3">
                                            {event.category || 'General'}
                                        </span>
                                        <span className="fw-bold text-success">
                                            ${event.price || '0'}
                                        </span>
                                    </div>

                                    <h5 className="fw-bold text-truncate">{event.title}</h5>
                                    <p className="text-muted small line-clamp-2" style={{ height: '40px', overflow: 'hidden' }}>
                                        {event.description || 'No description provided.'}
                                    </p>

                                    <div className="mt-3 pt-3 border-top">
                                        <div className="small text-muted mb-3">
                                            <GeoAlt className="me-1 text-danger" />
                                            {event.location}
                                        </div>
                                        
                                        <Link
                                            to={`/events/${event.id}`}
                                            className="btn btn-dark w-100 rounded-3 fw-bold"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    /* --- NO RESULTS STATE --- */
                    <div className="text-center py-5 w-100">
                        <Search size={50} className="text-muted opacity-25 mb-3" />
                        <h4 className="text-muted fw-light">
                            We couldn't find any events matching your criteria.
                        </h4>
                        <button
                            className="btn btn-primary mt-3 rounded-pill px-4"
                            onClick={() => { setSelectedCategory("All"); }}
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventList;