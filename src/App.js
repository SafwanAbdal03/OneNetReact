import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

function App() {
  const [img, setImg] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/data')
      .then(response => {
        console.log(response.data);
        if (response.data.errno === 0) {
          setImg(response.data.data.datastreams[0].datapoints[0].value);
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
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {error ? error : img}
        </a>
      </header>
    </div>
  );
}

export default App;