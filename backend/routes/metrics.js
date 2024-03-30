// metrics.js

const express = require('express');
const router = express.Router();

const getCpuUtilization = require('../controllers/getCpuUtilization');
const getNetworkIn = require('../controllers/getNetworkIn');

router.get('/cpu-utilization', getCpuUtilization);
router.get('/network-in', getNetworkIn);

module.exports = router;