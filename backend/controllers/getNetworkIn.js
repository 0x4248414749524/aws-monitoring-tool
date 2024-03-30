// controllers/getCpuUtilization.js

const getNetworkInParams = require('../models/networkIn');
const AWS = require('aws-sdk');
const cloudwatch = new AWS.CloudWatch();


module.exports = async function getNetworkIn(req, res) {
  const params = getNetworkInParams('your-instance-id-here'); //replace with your instance id


  AWS.config.update({ 
    region: 'us-east-1',
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY
});

  try {
    const data = await cloudwatch.getMetricStatistics(params).promise();
    res.json({
      instanceId: params.Dimensions[0].Value,
      ...data});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve Network In data' });
  }
};