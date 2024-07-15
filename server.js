const express = require('express');
const axios = require('axios');
const cors = require('cors');
const api = require('API-Key');

const app = express();
const port = process.env.PORT || 443;
// for http, the port number 8080 is working perfectly fine. 
//Now testing for https.

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.use(cors());

app.get('/api/data', async (req, res) => {
  try {
    const url = 'https://api.onenet.hk.chinamobile.com/devices/161379916/datapoints';
    //const headers = { 'API-Key': '7Nvk6zxDmTRJ2tjKz8yXStogHRI=' };
    const headers = { 'API-Key': api };
    console.log(`Requesting URL: ${url} with headers:`, headers);

    const response = await axios.get(url, { headers });
    console.log('Response Data:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).send({
      message: 'Error fetching data',
      details: error.response ? error.response.data : error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Proxy server is running at http://localhost:${port}`);
});

module.exports = app;
