const express = require("express");
const formidable = require("express-formidable");
const session = require("express-session");
const { getAllUsers, updateUser, deleteUser, registerUser, loginUser, verifyEmail, logoutUser } = require("../controllers/users");
const userRouter = express.Router();
const dev = require("../config/users")

userRouter.use(
    session({
        name: "user_session",
        secret: dev.app.sessionSecretKey,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false, maxAge: 600 }
    })
)

userRouter.get("/", getAllUsers);
userRouter.post("/register", formidable(), registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", logoutUser);
userRouter.post("/verify-email", verifyEmail);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);

module.exports = userRouter;