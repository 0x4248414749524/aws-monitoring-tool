// models/cpuUtilization.js
const AWS = require('aws-sdk');

AWS.config.update({ 
    region: 'us-east-1',
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY
}); 

module.exports = function getCPUUtilizationParams(instanceId) {
    return {
      Namespace: 'AWS/EC2',
      MetricName: 'CPUUtilization',
      Dimensions: [
        {
          Name: 'InstanceId',
          Value: instanceId
        }
      ],
      StartTime: new Date(Date.now() - 3600000), // Get data for the last hour
      EndTime: new Date(),
      Period: 60,
      Statistics: ['Average'], // Get data points every minute
    };
  };