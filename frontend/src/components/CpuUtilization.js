import React, { useEffect, useState } from 'react';
import { Chart as ChartJS } from 'chart.js'; 


const CpuUtilization = () => {
  const [cpuData, setCpuData] = useState(null);
  const [error, setError] = useState(null); 
  
  useEffect(() => {
    const importControllers = async () => {
      try {
        await Promise.all([
          import('chart.js/auto'),
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
        const response = await fetch('/api/metrics/cpu-utilization');
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

        setCpuData({ labels, values, instanceId }); // Set data in an object
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
    if (!cpuData || error) {
      return; // Handle empty or error states if needed
    }

    const ctx = document.getElementById('cpuChart').getContext('2d');

    // Destroy any existing chart before creating a new one
    if (ChartJS.getChart('cpuChart')) {
      ChartJS.getChart('cpuChart').destroy();
    }

    new ChartJS(ctx, {
      type: 'line', // Use the 'line' chart type explicitly
      data: {
        labels: cpuData.labels,
        datasets: [
          {
            label: `CPU Utilization (%) - Instance ID: ${cpuData.instanceId}`, // Display instance ID in the label
            data: cpuData.values,
            backgroundColor: 'rgba(0, 0, 0, 1)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: false,
        scales: {
          y : { 
            title: {
              display: true,
              text: 'Percentage', 
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
  }, [cpuData, error]); // Re-run only when cpuData or error changes

  if (error) {
    return <div>Error fetching CPU utilization data: {error.message}</div>;
  }

  return (
    <div>
      {/* Display loading message or placeholder while data is being fetched */}
      {!cpuData && <p>Loading CPU utilization data...</p>}
      {/* Conditionally render the canvas element only when cpuData is populated */}
      {cpuData && (
        <canvas id="cpuChart" className='cpu-chart'></canvas>
      )}
    </div>
  );
};

export default CpuUtilization;