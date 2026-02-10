import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    Speedometer2, 
    PlusSquare, 
    QrCodeScan, 
    People, 
    CalendarEvent 
} from 'react-bootstrap-icons';
import './AdminSidebar.css'; // We will create this next

const AdminSidebar = () => {
    const location = useLocation();

    const menuItems = [
        { path: '/admin', name: 'Dashboard', icon: <Speedometer2 /> },
        { path: '/admin/add-event', name: 'Add Event', icon: <PlusSquare /> },
        { path: '/admin/scanner', name: 'Gate Scanner', icon: <QrCodeScan /> },
        { path: '/calendar', name: 'Event Calendar', icon: <CalendarEvent /> },
    ];

    return (
        <div className="admin-sidebar bg-dark text-white p-3 shadow-lg">
            <div className="text-center mb-4 pt-3">
                <h5 className="fw-bold text-primary">ADMIN PANEL</h5>
                <hr className="bg-secondary" />
            </div>
            <ul className="nav nav-pills flex-column mb-auto">
                {menuItems.map((item) => (
                    <li className="nav-item mb-2" key={item.path}>
                        <Link 
                            to={item.path} 
                            className={`nav-link text-white d-flex align-items-center gap-3 rounded-3 p-3 ${location.pathname === item.path ? 'active btn-primary' : 'hover-effect'}`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminSidebar;