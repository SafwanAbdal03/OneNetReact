import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [img, setImg] = useState(null);

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    baseurl: 'https://api.onenet.hk.chinamobile.com/devices/161379916/datapoints',
    headers: { 
      'APi-Key': '7Nvk6zxDmTRJ2tjKz8yXStogHRI=',
      "Host": "postman-echo.com",
      "User-Agent": "PostmanRuntime/7.39.0",
      "Accept": "*/*",
      "Content-Type": "application/json",
      "Connection": "keep-alive",
      "Accept-Encoding": "gzip, deflate, br",
    }
  };

  axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });

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
          {img}
        </a>  
      </header>
    </div>
  );
}

export default App;
