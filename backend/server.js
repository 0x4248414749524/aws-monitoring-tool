// server.js
require('dotenv').config();

const express = require('express');
const AWS = require('aws-sdk');
const cookieParser = require('cookie-parser'); // Import cookie-parser
const cors = require('cors');
const scanUrl = require('./routes/scanUrl');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

//routes
app.use('/api/metrics', require('./routes/metrics'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/profile'));
app.use('/api', scanUrl);

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected')

    app.listen(process.env.PORT, () => {
      console.log('Server is running on port', process.env.PORT);
    });
  })
  .catch(err => console.error(err));

