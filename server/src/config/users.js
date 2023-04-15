require('dotenv').config()

const dev = {
    app: {
        serverPort: process.env.SERVER_PORT || 3002,
        jtwSecretKey: process.env.JWT_SECRET_KEY || "4124E€FASFSFRF325!"
    },
    db: {
        url: process.env.DB_URL || "mongodb+srv://berkdisli:p9u9IlnQKo1MrnCm@cluster0.fqvhdfy.mongodb.net/users"
    },
}

module.exports = dev;