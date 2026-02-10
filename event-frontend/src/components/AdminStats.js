import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AdminStats = ({ bookings }) => {
    // 1. Calculate Check-in Data
    const checkedInCount = bookings.filter(b => b.status === "CHECKED_IN").length;
    const pendingCount = bookings.length - checkedInCount;

    const pieData = {
        labels: ['Checked In', 'Remaining'],
        datasets: [{
            data: [checkedInCount, pendingCount],
            backgroundColor: ['#0dcaf0', '#e9ecef'],
            borderWidth: 0,
        }],
    };

    // 2. Calculate Revenue (assuming each booking has an event price)
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.event?.price || 0), 0);

    return (
        <div className="row g-4 mt-4">
            {/* Summary Cards */}
            <div className="col-md-4">
                <div className="card border-0 shadow-sm rounded-4 p-3 bg-primary text-white text-center">
                    <h6 className="text-uppercase small fw-bold">Total Sales</h6>
                    <h2 className="mb-0">${totalRevenue.toFixed(2)}</h2>
                </div>
            </div>

            {/* Attendance Chart */}
            <div className="col-md-4">
                <div className="card border-0 shadow-sm rounded-4 p-3 text-center h-100">
                    <h6 className="fw-bold mb-3">Attendance Progress</h6>
                    <div style={{ maxHeight: '200px' }}>
                        <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                    </div>
                    <p className="mt-2 mb-0 small text-muted">
                        {checkedInCount} of {bookings.length} guests arrived
                    </p>
                </div>
            </div>
            
            <div className="col-md-4">
                <div className="card border-0 shadow-sm rounded-4 p-3 bg-info text-white text-center">
                    <h6 className="text-uppercase small fw-bold">Total Bookings</h6>
                    <h2 className="mb-0">{bookings.length}</h2>
                </div>
            </div>
        </div>
    );
};

export default AdminStats;