const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get current user's profile
router.get('/profile', auth, async (req, res) => {
    try {
      
      if (!req.user) {
        return res.status(401).send('Unauthorized');
      }
  
      const user = await User.findById(req.userId).select('-password');
  
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
module.exports = router;