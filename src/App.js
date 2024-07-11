import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

function App() {
  const [combinedBase64, setCombinedBase64] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/data')
      .then(response => {
        console.log(response.data);
        if (response.data.errno === 0) {
          const datastreams = response.data.data.datastreams;
          const base64Values = datastreams.map(stream => stream.datapoints[0].value);
          const combinedBase64 = base64Values.join(''); // Concatenate the base64 values
          setCombinedBase64(combinedBase64);
        } else {
          setError('Failed to load data');
        }
      })
      .catch(error => {
        console.error(error);
        setError(`Error fetching data: ${error.message}`);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        {error ? (
          <p>{error}</p>
        ) : (
          <div>
            <h3>Base64 Data:</h3>
            <pre className="App-pre">{combinedBase64}</pre>
          </div>
        )}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

