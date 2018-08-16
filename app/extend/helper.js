const bcrypt = require('bcryptjs');
exports.bhash = str => {
  return bcrypt.hashSync(str, 10);
};

exports.bcompare = (str, hash) => {
  return bcrypt.compareSync(str, hash);
};

exports.checkNullOrUndefined = (...values) => {
  for (let i = 0; i < values.length; i++) {
    if (values[i] === null || values[i] === undefined) {
      return true;
    }
  }
  return false;
};