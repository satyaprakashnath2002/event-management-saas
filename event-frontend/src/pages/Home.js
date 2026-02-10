import React, { useState, useEffect } from 'react';
import EventService from '../services/EventService';
import EventCard from '../components/EventCard';
import { Search, FilterCircle } from 'react-bootstrap-icons';
import FeaturedCarousel from '../components/FeaturedCarousel';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    const categories = ['All', 'Music', 'Tech', 'Sports', 'Workshops', 'Art'];

    // 1️⃣ Fetch events
    useEffect(() => {
        EventService.getEvents()
            .then(res => {
                // 🔒 Defensive extraction (handles res.data or res.data.data)
                const data = Array.isArray(res.data)
                    ? res.data
                    : Array.isArray(res.data?.data)
                    ? res.data.data
                    : [];

                console.log('EVENTS LOADED:', data.length);
                console.table(data);

                setEvents(data);
                setFilteredEvents(data);
            })
            .catch(err => {
                console.error('Error fetching events:', err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // 2️⃣ Search + Category Filter
    useEffect(() => {
        const term = searchTerm.toLowerCase().trim();
        const cat = selectedCategory.toLowerCase();

        const results = events.filter(event => {
            const title = (event.title || '').toLowerCase();
            const location = (event.location || '').toLowerCase();
            const category =
                (event.category || event.eventCategory || '').toLowerCase();

            const matchesSearch =
                term === '' ||
                title.includes(term) ||
                location.includes(term);

            const matchesCategory =
                selectedCategory === 'All' ||
                category.includes(cat) ||
                title.includes(cat);

            return matchesSearch && matchesCategory;
        });

        setFilteredEvents(results);
    }, [searchTerm, selectedCategory, events]);

    // 3️⃣ Loading state
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="text-center">
                    <div className="spinner-grow text-info" />
                    <p className="mt-3 text-muted fw-bold">
                        Gathering events for you...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4 pb-5">
            {/* Featured Carousel */}
            {events.length > 0 && (
                <div className="mb-5 rounded-4 overflow-hidden shadow">
                    <FeaturedCarousel events={events.slice(0, 3)} />
                </div>
            )}

            {/* Search */}
            <div className="row mb-4 justify-content-center">
                <div className="col-lg-7">
                    <div className="input-group input-group-lg shadow-sm rounded-pill overflow-hidden bg-white">
                        <span className="input-group-text bg-white border-0 ps-4">
                            <Search className="text-muted" />
                        </span>
                        <input
                            type="text"
                            className="form-control border-0 shadow-none py-3"
                            placeholder="Find your next experience..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Categories */}
                    <div className="d-flex justify-content-center flex-wrap mt-4">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`btn btn-sm m-1 rounded-pill px-4 fw-bold ${
                                    selectedCategory === cat
                                        ? 'btn-primary shadow'
                                        : 'btn-light text-muted border'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <hr className="my-5 opacity-25" />

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold mb-1">
                        {selectedCategory === 'All'
                            ? 'Upcoming Events'
                            : `${selectedCategory} Events`}
                    </h3>
                    <span className="badge bg-light text-dark border px-3 py-2 rounded-pill">
                        Showing {filteredEvents.length} of {events.length}
                    </span>
                </div>

                {selectedCategory !== 'All' && (
                    <button
                        className="btn btn-link text-danger"
                        onClick={() => setSelectedCategory('All')}
                    >
                        Clear Filters
                    </button>
                )}
            </div>

            {/* Grid */}
            <div className="row g-4">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map((event, index) => (
                        <div
                            className="col-md-6 col-lg-4"
                            key={event.id || index}
                        >
                            {/* 🔒 EventCard protected by valid event */}
                            <EventCard event={event} />
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center py-5">
                        <FilterCircle
                            size={50}
                            className="text-muted mb-3 opacity-50"
                        />
                        <h4 className="text-muted">
                            No events match your criteria
                        </h4>
                        <p>Try changing filters or search keywords</p>
                        <button
                            className="btn btn-outline-primary rounded-pill px-4"
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('All');
                            }}
                        >
                            See Everything
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
