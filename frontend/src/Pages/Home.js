import React from 'react';
import CpuUtilization from '../components/CpuUtilization'; // Assuming CpuUtilization.js is in the components directory
import NetworkUtilization from '../components/NetworkUtilization';

const Home = () => {
    return (
        <div className="charts-container">
            <CpuUtilization />
            <NetworkUtilization />
        </div>
    );
};

export default Home;