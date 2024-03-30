const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send('No token provided');
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).send('Token error');
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send('Token malformatted');
  }

  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      console.error(err);
      return res.status(401).send('Invalid token');
    }

    req.userID = decoded;
    next();
  });
};

module.exports = auth;