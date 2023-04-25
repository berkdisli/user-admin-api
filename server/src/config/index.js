require('dotenv').config()

const dev = {
    app: {
        serverPort: process.env.SERVER_PORT || 3002,
        jtwSecretKey: process.env.JWT_SECRET_KEY || "4124E€FASFSFRF325!",
        smtpUsername: process.env.SMTP_USERNAME || "berkdisli17@gmail.com",
        smtpPassword: process.env.SMTP_PASSWORD || "hwtfzezgzlxpgnfb",
        clientURL: process.env.CLIENT_URL || 3000,
        sessionSecretKey: process.env.SESSION_SECRET_KEY || "FA89SF908!ASFHjhsdfj",
    },
    db: {
        url: process.env.DB_URL || "mongodb+srv://berkdisli:p9u9IlnQKo1MrnCm@cluster0.fqvhdfy.mongodb.net/users"
    },
}

module.exports = dev;