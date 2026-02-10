import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    PersonCircle, 
    ShieldLock, 
    TicketPerforated, 
    BoxArrowRight, 
    Calendar3, 
    QrCodeScan // Added for the Scanner icon
} from 'react-bootstrap-icons';
import AuthService from '../services/AuthService';

const Navbar = ({ onSearch }) => {
    const [currentUser, setCurrentUser] = useState(undefined);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const logOut = () => {
        AuthService.logout();
        setCurrentUser(undefined);
        setShowDropdown(false);
        navigate("/login");
        window.location.reload();
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow">
            <div className="container">
                {/* Brand */}
                <Link to={"/"} className="navbar-brand fw-bold text-info">
                    EventMaster
                </Link>

                {/* Central Search Bar */}
                <div className="d-flex flex-grow-1 mx-4">
                    <input
                        className="form-control rounded-pill border-0 px-3 shadow-sm"
                        type="search"
                        placeholder="Search events..."
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div>

                <div className="d-flex align-items-center">
                    <ul className="navbar-nav me-3">
                        <li className="nav-item">
                            <Link to={"/calendar"} className="nav-link d-flex align-items-center">
                                <Calendar3 className="me-1" /> Calendar
                            </Link>
                        </li>
                    </ul>

                    {/* Unified Profile Dropdown */}
                    <div className="dropdown" ref={dropdownRef}>
                        <button 
                            className="btn btn-link text-light p-0 border-0 shadow-none position-relative" 
                            type="button" 
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            <PersonCircle size={30} />
                            {currentUser?.role === 'ADMIN' && (
                                <span className="position-absolute top-0 start-100 translate-middle badge border border-light rounded-circle bg-danger p-1">
                                    <span className="visually-hidden">Admin mode</span>
                                </span>
                            )}
                        </button>
                        
                        <ul className={`dropdown-menu dropdown-menu-end shadow-lg mt-2 p-2 ${showDropdown ? 'show' : ''}`} 
                            style={{ position: 'absolute', right: 0, minWidth: '220px', borderRadius: '12px' }}>
                            
                            {currentUser ? (
                                <>
                                    <li className="px-3 py-2">
                                        <div className="fw-bold text-dark text-truncate">Hi, {currentUser.name}</div>
                                        <div className="text-muted x-small" style={{ fontSize: '0.75rem' }}>{currentUser.email}</div>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    
                                    <li>
                                        <Link className="dropdown-item rounded-2 py-2" to="/dashboard" onClick={() => setShowDropdown(false)}>
                                            <TicketPerforated className="me-2 text-primary" /> My Tickets
                                        </Link>
                                    </li>

                                    {/* --- ADMIN ONLY SECTION --- */}
                                    {currentUser.role === 'ADMIN' && (
                                        <>
                                            <li>
                                                <Link className="dropdown-item rounded-2 py-2" to="/admin" onClick={() => setShowDropdown(false)}>
                                                    <ShieldLock className="me-2 text-danger" /> Admin Panel
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item rounded-2 py-2 text-info fw-bold" to="/admin/scanner" onClick={() => setShowDropdown(false)}>
                                                    <QrCodeScan className="me-2" /> Ticket Scanner
                                                </Link>
                                            </li>
                                        </>
                                    )}
                                    
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button className="dropdown-item rounded-2 py-2 text-danger" onClick={logOut}>
                                            <BoxArrowRight className="me-2" /> Logout
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link className="dropdown-item rounded-2 py-2" to="/login" onClick={() => setShowDropdown(false)}>
                                            Login
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item rounded-2 py-2 fw-bold text-info" to="/register" onClick={() => setShowDropdown(false)}>
                                            Sign Up
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;