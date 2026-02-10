import React from 'react';
import { useNavigate } from 'react-router-dom';

const FeaturedCarousel = ({ events }) => {
    const navigate = useNavigate();
    
    // Take only the top 3 events for the featured section
    const featured = events.slice(0, 3);

    if (featured.length === 0) return null;

    return (
        <div id="eventCarousel" className="carousel slide mb-5 shadow-lg rounded-4 overflow-hidden" data-bs-ride="carousel">
            <div className="carousel-indicators">
                {featured.map((_, index) => (
                    <button key={index} type="button" data-bs-target="#eventCarousel" data-bs-slide-to={index} className={index === 0 ? "active" : ""}></button>
                ))}
            </div>
            <div className="carousel-inner">
                {featured.map((event, index) => (
                    <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={event.id} style={{ height: '450px' }}>
                        <img 
                            src={`https://picsum.photos/seed/${event.id + 100}/1200/500`} 
                            className="d-block w-100 h-100" 
                            style={{ objectFit: 'cover', filter: 'brightness(60%)' }} 
                            alt={event.title} 
                        />
                        <div className="carousel-caption d-none d-md-block text-start pb-5">
                            <span className="badge bg-primary mb-2">{event.category}</span>
                            <h1 className="display-4 fw-bold">{event.title}</h1>
                            <p className="lead">{event.location} | Starting at ${event.price}</p>
                            <button 
                                onClick={() => navigate(`/events/${event.id}`)} 
                                className="btn btn-light btn-lg rounded-pill fw-bold px-4"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#eventCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon"></span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#eventCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon"></span>
            </button>
        </div>
    );
};

export default FeaturedCarousel;