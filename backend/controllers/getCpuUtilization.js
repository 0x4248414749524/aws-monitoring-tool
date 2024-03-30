// controllers/getCpuUtilization.js

const getCPUUtilizationParams = require('../models/cpuUtilizaion');
const AWS = require('aws-sdk');
const cloudwatch = new AWS.CloudWatch();

module.exports = async function getCpuUtilization(req, res) {
  const params = getCPUUtilizationParams('your-instance-id-here'); //replace with your instance id

  try {
    const data = await cloudwatch.getMetricStatistics(params).promise();
    res.json({
        instanceId: params.Dimensions[0].Value,
        ...data});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve CPU utilization data' });
  }
};