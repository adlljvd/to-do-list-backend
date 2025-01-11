//if (process.env.NODE_ENV !== 'production') {
//require('dotenv').config();
//}

const jwt = require("jsonwebtoken");
const privateKey = process.env.SECRET_KEY;

function signToken(payload) {
  return jwt.sign(payload, privateKey);
}

function verifyToken(token) {
  return jwt.verify(token, privateKey);
}

module.exports = { signToken, verifyToken };
