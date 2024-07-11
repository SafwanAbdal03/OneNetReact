const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 4000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/api/data', async (req, res) => {
    try {
        const response = await axios.get('https://api.onenet.hk.chinamobile.com/devices/161379916/datapoints', {
            headers: {
                'API-Key': '7Nvk6zxDmTRJ2tjKz8yXStogHRI='
            }
        });
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