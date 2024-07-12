//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; 
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());

app.get('/api/data', async (req, res) => {
  try {
    const url = 'http://api.onenet.hk.chinamobile.com/devices/161379916/datapoints';
    const headers = { 'API-Key': '7Nvk6zxDmTRJ2tjKz8yXStogHRI=' };
    console.log(`Requesting URL: ${url} with headers:`, headers);

    const response = await axios.get(url, { headers });
    console.log('Response Data:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error.response ? error.response.data : error.message);
    res.status(500).send('Error fetching data');
  }
});

app.listen(port, () => {
  console.log(`Proxy server is running at http://localhost:${port}`);
});

module.exports = app;

