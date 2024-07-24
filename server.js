const express = require('express');
const axios = require('axios');
const cors = require('cors');
const multer = require('multer');
const FormData = require('form-data');

const app = express();
const port = process.env.PORT || 443;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.use(cors());
app.use(express.json());

const upload = multer();

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

app.post('/api/upscale', upload.single('file'), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append('file', req.file.buffer, req.file.originalname);
    formData.append('scale', '2'); // Upscale by a factor of 2
    formData.append('noise', '1'); // Add noise reduction if necessary

    const response = await axios.post('https://waifu2x.booru.pics/', formData, {
      headers: {
        ...formData.getHeaders()
      },
      responseType: 'arraybuffer'
    });

    res.set('Content-Type', 'image/jpeg');
    res.send(response.data);
  } catch (error) {
    console.error('Error upscaling image:', error);
    res.status(500).send('Error upscaling image');
  }
});

app.listen(port, () => {
  console.log(`Proxy server is running at http://localhost:${port}`);
});

module.exports = app;


