// express
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//database
const connectDB = require("./src/config/db");

// morgan & cors
const morgan = require("morgan");
const cors = require("cors");
app.use(morgan("dev"));
app.use(cors());

//admin
const isAdmin = (req, res, next) => {
    req.body.admin = true;
    next();
}
app.post("/users", isAdmin, (req, res) => {
    if (req.body.admin) {
        return res.status(201).json({ message: " user was created " })
    }//403: no access
    return res.status(403).json({ message: " only admin has an access" })
});

//server working
app.get("/", (req, res) => {
    res.status(200).json({ message: "testing api" });
});


//broke
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send("Something broke")
});

//error
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});

//not found
app.use((req, res, next) => {
    res.status(404).json({ message: "router not found" });
});


//port listening
const PORT = 8080;

app.listen(PORT, () => {
    console.log(`The app is listening at http://localhost:${PORT}`);
    connectDB();
})


