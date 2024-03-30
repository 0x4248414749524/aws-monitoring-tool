import React, { useEffect, useState } from 'react';
import { Chart as ChartJS } from 'chart.js'; 


const NetworkUtilization = () => {
  const [networkData, setNetworkData] = useState(null); // Initialize with null
  const [error, setError] = useState(null); // State for error handling

  // Import the required controllers dynamically if not already available
  useEffect(() => {
    const importControllers = async () => {
      try {
        await Promise.all([
          import('chart.js/auto'), // Import the `auto` plugin for automatic registration
        ]);
        console.log('Chart.js controllers imported successfully.');
      } catch (error) {
        console.error('Error importing Chart.js controllers:', error);
      }
    };

    importControllers();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/metrics/network-in');
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        const data = await response.json();

        // Check if Datapoints array is empty or undefined
        if (!data.Datapoints || data.Datapoints.length === 0) {
          throw new Error('No data available');
        }

        // Sort the Datapoints array by Timestamp in ascending order
        data.Datapoints.sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));

        // Extract timestamps, CPU utilization values, and instance ID from the response
        const labels = data.Datapoints.map((point) => convertTimestampToTime(point.Timestamp)); // Convert timestamps to time strings
        const values = data.Datapoints.map((point) => point.Average); // Convert to percentage
        const instanceId = data.instanceId;

        setNetworkData({ labels, values, instanceId }); // Set data in an object
      } catch (error) {
        setError(error); // Set error state for handling
      }
    };

    fetchData();
  }, []); // Re-run only on initial render

  // Function to convert timestamp to time string (replace with your desired formatting)
  function convertTimestampToTime(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`; // Format as HH:MM (adjust per needs)
  }

  useEffect(() => {
    if (!networkData || error) {
      return; // Handle empty or error states if needed
    }

    const ctx = document.getElementById('netChart').getContext('2d');

    // Destroy any existing chart before creating a new one
    if (ChartJS.getChart('netChart')) {
      ChartJS.getChart('netChart').destroy();
    }

    new ChartJS(ctx, {
      type: 'line', // Use the 'line' chart type explicitly
      data: {
        labels: networkData.labels,
        datasets: [
          {
            label: `network In Traffic (%) - Instance ID: ${networkData.instanceId}`, // Display instance ID in the label
            data: networkData.values,
            backgroundColor: 'rgba(0, 0, 0, 1)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: false, // Ensures chart adapts to different device sizes 
        scales: {
            y : { 
                title: {
                  display: true,
                  text: 'Bytes', 
                },
                beginAtZero: false,             
                },
              x : {
                title: {
                  display: true,
                  text: 'Time',
                },
                ticks: {
                    font: {
                      size: 10,
                    },
                  },             
              },
        },
      },
    });
  }, [networkData, error]); // Re-run only when cpuData or error changes

  if (error) {
    return <div>Error fetching CPU utilization data: {error.message}</div>;
  }

  return (
    <div>
      {/* Display loading message or placeholder while data is being fetched */}
      {!networkData && <p>Loading Network In data...</p>}
      {/* Conditionally render the canvas element only when cpuData is populated */}
      {networkData && (
        <canvas id="netChart" className='net-chart'></canvas>
      )}
    </div>
  );
};

export default NetworkUtilization;