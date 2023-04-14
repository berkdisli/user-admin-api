var bcrypt = require('bcryptjs');

generateHashPassword = async (plainPassword) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(plainPassword, salt)
}

module.exports = { generateHashPassword }