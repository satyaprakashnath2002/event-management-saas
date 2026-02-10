import React from 'react';
import { Link } from 'react-router-dom';
import { GeoAlt, CalendarEvent } from 'react-bootstrap-icons';

const EventCard = ({ event }) => {
    // 🛑 Absolute safety check
    if (!event) return null;

    // 🔒 ID fallback (prevents crashes)
    const eventId = event.id ?? Math.random().toString(36).substring(2);

    /**
     * 🖼️ Dynamic Category-Based Fallbacks
     * If all images are same, this logic provides a unique visual 
     * based on the event's category if no specific URL is provided.
     */
    const categoryImages = {
        'TECH': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800',
        'MUSIC': 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800',
        'SPORTS': 'https://images.unsplash.com/photo-1461896756913-c7116679e9da?auto=format&fit=crop&w=800',
        'ART': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800',
        'WORKSHOPS': 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800'
    };

    const defaultImage = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800";
    
    // Logic: User Image -> Category Image -> Generic Default
    const eventImage = event.imageUrl || categoryImages[event.category?.toUpperCase()] || defaultImage;

    // 🔒 Date handling
    const rawDate = event.startDate || event.start_date;
    const parsedDate = rawDate ? new Date(rawDate) : null;
    const formattedDate =
        parsedDate && !isNaN(parsedDate)
            ? parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'TBD';

    // 🔒 Price handling
    const price =
        typeof event.price === 'number' && event.price > 0
            ? `$${event.price}`
            : 'Free';

    // 🔒 Safe fields
    const title = event.title || 'Untitled Event';
    const description = event.description || 'No description available.';
    const category = event.category || 'General';
    const location = event.location || 'Online';

    return (
        <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden card-hover-effect border-top-0">
            {/* Image Section with Overlay Badge */}
            <div className="position-relative">
                <img
                    src={eventImage}
                    className="card-img-top"
                    alt={title}
                    style={{ height: '220px', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = defaultImage; }} 
                />
                <div className="position-absolute top-0 end-0 m-3">
                    <span className="badge bg-white text-dark shadow-sm px-3 py-2 rounded-pill small fw-bold opacity-90">
                        {price}
                    </span>
                </div>
            </div>

            <div className="card-body p-4">
                <div className="mb-2">
                    <span className="text-primary fw-bold small text-uppercase tracking-wider">
                        {category}
                    </span>
                </div>

                <h5 className="card-title fw-bold text-dark mb-3">
                    {title}
                </h5>

                <p
                    className="card-text text-muted small mb-4"
                    style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: '40px'
                    }}
                >
                    {description}
                </p>

                <div className="pt-3 border-top border-light small text-muted">
                    <div className="d-flex align-items-center mb-2">
                        <CalendarEvent className="me-2 text-primary" />
                        <span>{formattedDate}</span>
                    </div>
                    <div className="d-flex align-items-center">
                        <GeoAlt className="me-2 text-primary" />
                        <span className="text-truncate">{location}</span>
                    </div>
                </div>
            </div>

            <div className="card-footer bg-white border-0 p-4 pt-0">
                <Link
                    to={`/events/${eventId}`}
                    className="btn btn-primary w-100 rounded-pill fw-bold shadow-sm transition-all py-2"
                >
                    Get Tickets
                </Link>
            </div>
        </div>
    );
};

export default EventCard;