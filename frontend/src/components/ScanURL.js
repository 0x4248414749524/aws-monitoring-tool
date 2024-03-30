import React, { useState } from 'react';

const ScanUrl = () => {
  const [url, setUrl] = useState('');
  const [scanResult, setScanResult] = useState(null);

  const scanUrl = async () => {
    const response = await fetch('http://localhost:4000/api/scan-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    const data = await response.text(); // Use .text() instead of .json()
    console.log(data);
    setScanResult(data);
    console.log(JSON.stringify({ url }));
  };

  return (
    <div>
      <input type="text" value={url} onChange={e => setUrl(e.target.value)} />
      <button onClick={scanUrl}>Scan URL</button>
      {scanResult && <p>{scanResult}</p>}
    </div>
  );
};

export default ScanUrl;