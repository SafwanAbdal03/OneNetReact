const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

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
    res.status(error.response ? error.response.status : 500).send({
      message: 'Error fetching data',
      details: error.response ? error.response.data : error.message
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Proxy server is running at http://localhost:${port}`);
});

module.exports = app;
