const express = require('express');
const AWS = require('aws-sdk');

const router = express.Router();

// Configure AWS SDK
AWS.config.update({
    region: 'us-east-1', // Replace with your desired AWS region
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY
});

// Create an EC2 service object
const ec2 = new AWS.EC2();

router.get('/', async (req, res) => {
    try {
        // Call the describeInstances method to retrieve a list of EC2 instances
        const data = await ec2.describeInstances().promise();
        console.log(data);

        // Extract the instances from the response
        const instances = data.Reservations.flatMap(reservation => reservation.Instances);
        console.log(instances);

        // Send the instances as the response
        res.json(instances);
    } catch (error) {
        console.error('Error listing EC2 instances:', error);
        res.status(500).json({ error: 'Failed to list EC2 instances' });
    }
});

// ... add similar routes for other resource-related functionalities

module.exports = router;