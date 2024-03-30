const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const LoginLog = require('../models/loginLog');

require('dotenv').config();

router.post('/register', async (req, res) => {
    const { name, username, email, password, mobileNumber } = req.body;
  
  
    const userExists = await User.findOne({ username });
  
    if (userExists) {
      return res.status(400).send('Username already exists');
    }
  
    const user = new User({ name, username, email, password, mobileNumber });
    await user.save();
    res.send('Registered successfully');
  });

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await user.checkPassword(password))) {
    return res.status(401).send('Invalid credentials');
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY);
  console.log('Issued token:', token);

  


  // Save the login log
  const log = new LoginLog({
    userId: user._id,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });
  await log.save();

  res.cookie('token', token, { httpOnly: true });
  res.json({ token });

});

module.exports = router;