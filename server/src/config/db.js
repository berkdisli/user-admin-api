const mongoose = require("mongoose");
const dev = require("./users")
const DB_URL = dev.db.url;

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log("connected to the db")
    } catch (err) {
        console.log(err)
    }
}

module.exports = connectDB;

