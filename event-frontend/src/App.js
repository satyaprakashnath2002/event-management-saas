import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import Navbar from './components/Navbar';
import ChatBot from './components/ChatBot';
import ProtectedRoute from './components/ProtectedRoute';
import AdminSidebar from './components/AdminSidebar'; 

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EventDetails from './pages/EventDetails';
import Payment from './pages/Payment';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CalendarView from './pages/CalendarView';
import TicketScanner from './pages/TicketScanner';
import AddEvent from './pages/AddEvent';

const AppLayout = ({ searchTerm, setSearchTerm }) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  // Fixes navigation "scroll-freeze"
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="d-flex min-vh-100">
      {/* 1. Sidebar: Only shows on /admin paths */}
      {isAdminPath && (
        <aside className="admin-sidebar-container shadow">
          <AdminSidebar />
        </aside>
      )}
      
      {/* 2. Main Content Area */}
      <div className={`flex-grow-1 d-flex flex-column main-wrapper ${isAdminPath ? 'admin-layout-wrapper' : ''}`}>
        
        <Navbar onSearch={setSearchTerm} />
        
        <main className="p-4 flex-grow-1"> 
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home searchTerm={searchTerm} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/calendar" element={<CalendarView />} />

            {/* User Protected Routes */}
            <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />

            {/* Admin Protected Routes */}
            <Route path="/admin">
              <Route index element={
                <ProtectedRoute isAdminRequired={true}><AdminDashboard /></ProtectedRoute>
              } />
              <Route path="scanner" element={
                <ProtectedRoute isAdminRequired={true}><TicketScanner /></ProtectedRoute>
              } />
              <Route path="add-event" element={
                <ProtectedRoute isAdminRequired={true}><AddEvent /></ProtectedRoute>
              } />
            </Route>

            <Route path="*" element={<div className="text-center py-5"><h4>404: Page Not Found</h4></div>} />
          </Routes>
        </main>
        
        <ChatBot />
      </div>
    </div>
  );
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Router>
      <AppLayout searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    </Router>
  );
}

export default App;