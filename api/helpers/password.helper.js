const bcrypt = require('bcrypt');
const chalk = require('chalk');

module.exports.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
}