process.eprocess.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Disable SSL verification (not recommended for production)

const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Use CORS middleware to handle cross-origin requests

const app = express();
const port = process.env.PORT || 8080;

app.use(cors()); // Enable all CORS requests

// Root route for testing
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Route to fetch data from OneNet
app.get('/api/data', async (req, res) => {
  try {
    const response = await axios.get('http://api.onenet.hk.chinamobile.com/devices/161379916/datapoints?API-Key=7Nvk6zxDmTRJ2tjKz8yXStogHRI=');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error.response ? error.response.data : error.message);
    res.status(500).send('Error fetching data');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Proxy server is running at http://localhost:${port}`);
});

module.exports = app;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Disable SSL verification (not recommended for production)

app.use(cors()); // Enable all CORS requests

// Root route for testing
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Route to fetch data from OneNet
app.get('/api/data', async (req, res) => {
  try {
    const response = await axios.get('http://api.onenet.hk.chinamobile.com/devices/161379916/datapoints?API-Key=7Nvk6zxDmTRJ2tjKz8yXStogHRI=');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error.response ? error.response.data : error.message);
    res.status(500).send('Error fetching data');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Proxy server is running at http://localhost:${port}`);
});

module.exports = app;


