const jwt = require('jsonwebtoken');

async function sign(payload) {
  return jwt.sign(payload, 's80hd987anod');
}

async function verify(token) {
  return jwt.verify(token, 's80hd987anod');
}

module.exports = {
  sign,
  verify,
};
