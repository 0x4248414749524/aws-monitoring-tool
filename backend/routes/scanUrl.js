const express = require('express');
const axios = require('axios');
const router = express.Router();
const FormData = require('form-data');
const { ApiGatewayManagementApi } = require('aws-sdk');

require('dotenv').config();

router.post('/scan-url', async (req, res) => {
  const urlToScan = req.body.url;

  let data = new FormData();
  data.append('url', urlToScan);

  try {
    const response = await axios.post('https://www.virustotal.com/api/v3/urls', data, {
      headers: {
        'x-apikey': process.env.VIRUSTOTAL_API_KEY
      }
    });
  
    if (response.status === 200) {
      if (response.data && response.data.data && response.data.data.attributes && response.data.data.attributes.stats) {
        const maliciousCount = response.data.data.attributes.stats.malicious;
        const result = maliciousCount > 0 ? 'The link is malicious' : 'The link is not malicious';
        res.send(result);
      } else {
        res.status(500).send('Error scanning URL: Response does not include required fields');
      }
    } else {
      console.log(`Error scanning URL: ${response.status} ${response.statusText}`);
      res.status(500).send('Error scanning URL');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Error scanning URL');
  }
});

module.exports = router;