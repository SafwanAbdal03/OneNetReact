const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 443;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.use(cors());

let deviceImages = {}; // Store images by device ID

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

    const datastreams = response.data.data.datastreams;
    const allowedIds = [
      '3200_0_5750', '3200_1_5750', '3200_2_5750', '3200_3_5750', '3200_4_5750', '3200_5_5750',
      '3200_6_5750', '3200_7_5750', '3200_8_5750', '3200_9_5750', '3200_10_5750', '3200_11_5750',
      '3200_12_5750', '3200_13_5750', '3200_14_5750', '3200_15_5750', '3200_16_5750', '3200_17_5750',
      '3200_18_5750', '3200_19_5750', '3200_20_5750', '3200_21_5750', '3200_22_5750',
      '3200_23_5750', '3200_24_5750', 'Image' // Added 'Image' to allowed IDs
    ];

    const sortedDatastreams = allowedIds.map(id =>
      datastreams.find(stream => stream.id === id)
    ).filter(stream => stream !== undefined);

    let concatenatedBase64 = '';
    let timestamp = '';
    let images = deviceImages[deviceId] || [];
    let seenTimestamps = new Set(images.map(img => img.timestamp));

    sortedDatastreams.forEach(stream => {
      if (stream.id === 'Image' && stream.datapoints && stream.datapoints.length > 0) {
        // If id is 'Image', treat the value as a single base64 string
        concatenatedBase64 = stream.datapoints[0].value;
        timestamp = stream.datapoints[0].at;

        if (!seenTimestamps.has(timestamp)) {
          images.push({ base64: concatenatedBase64, timestamp });
          seenTimestamps.add(timestamp);
        }
        concatenatedBase64 = '';
        timestamp = '';
      } else if (stream.datapoints && stream.datapoints.length > 0 && stream.datapoints[0].value !== "'0'") {
        // Existing logic for other datastreams
        concatenatedBase64 += stream.datapoints[0].value;
        timestamp = stream.datapoints[0].at;
      } else if (concatenatedBase64) {
        if (!seenTimestamps.has(timestamp)) {
          images.push({ base64: concatenatedBase64, timestamp });
          seenTimestamps.add(timestamp);
        }
        concatenatedBase64 = '';
        timestamp = '';
      }
    });

    if (concatenatedBase64 && !seenTimestamps.has(timestamp)) {
      images.push({ base64: concatenatedBase64, timestamp });
      seenTimestamps.add(timestamp);
    }

    // Keep only the latest 5 images
    if (images.length > 5) {
      images = images.slice(-5);
    }

    deviceImages[deviceId] = images;

    res.json({ errno: 0, images });
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





