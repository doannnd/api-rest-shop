const bcrypt = require('bcrypt');

module.exports.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
}

module.exports.comparePassword = (currentPassword, dbPassword) => {
    return bcrypt.compareSync(currentPassword, dbPassword);
}