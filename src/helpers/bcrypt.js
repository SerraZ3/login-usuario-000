const { compareSync, hashSync } = require("bcrypt");

module.exports = {
  generateHash: (payload) => hashSync(payload, 10),
  compareHash: (payload, hashed) => compareSync(payload, hashed),
};
