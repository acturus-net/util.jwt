const dotenv = require('dotenv-safe').config();
const moment = require('moment');
const jwt = require('jsonwebtoken');

const options = {
  header: {
    "alg": process.env.JWT_ALG || "RS256",
    "kid": process.env.JWT_KID || "keyid",
    "typ": process.env.JWT_TYP || "JWT"
  }
}
const payload = {
  "iss": process.env.JWT_ISS,
  "sub": process.env.JWT_SUB,
  "aud": process.env.JWT_AUD,
  "name": process.env.JWT_NAME,
  "iat": Math.round(moment().toDate().getTime() / 1000),
  "exp": Math.round(moment().add(1, 'year').toDate().getTime() / 1000)
}

console.log(payload);

const privateKey = process.env.PRIVATE_KEY;

const token = jwt.sign(payload, privateKey, options);

console.log(token);
