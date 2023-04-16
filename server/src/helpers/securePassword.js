var bcrypt = require('bcryptjs');

const generateHashPassword = async (plainPassword) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(plainPassword, salt)
}

const compareHashPassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword)
}

module.exports = { generateHashPassword, compareHashPassword }