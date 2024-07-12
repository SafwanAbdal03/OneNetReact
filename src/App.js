import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [img, setImg] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/data')
      .then(response => {
        console.log(response.data);
        if (response.data.errno === 0) {
          const combinedBase64 = response.data.data.datastreams.map(stream => stream.datapoints[0].value).join('');
          setImg(combinedBase64);
        } else {
          setError('Failed to load data');
        }
      })
      .catch(error => {
        console.error('Detailed error:', error);
        setError(`Error fetching data: ${error.response ? error.response.data.message : error.message}`);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Base64 Data:</p>
        {error ? <p>{error}</p> : <img src={`data:image/jpeg;base64,${img}`} alt="Fetched from API" />}
      </header>
    </div>
  );
}

export default App;

