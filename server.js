const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.use(cors());

app.get('/api/data', async (req, res) => {
  const apiKey = req.query.api;
  const deviceId = req.query.device;

  if (!apiKey || !deviceId) {
    return res.status(400).json({ message: 'API key and device ID are required' });
  }

  try {
    const url = `https://api.onenet.hk.chinamobile.com/devices/${deviceId}/datapoints`;
    const headers = { 'API-Key': apiKey };
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

