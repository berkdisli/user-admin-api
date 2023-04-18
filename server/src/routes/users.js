const express = require("express");
const formidable = require("express-formidable");
const session = require("express-session");
const { getAllUsers, updateUser, deleteUser, registerUser, loginUser, verifyEmail, userProfile, logoutUser } = require("../controllers/users");
const { isLoggedIn, isLoggedOut } = require("../middlewares/auth");
const userRouter = express.Router();
const dev = require("../config/users")

userRouter.use(
    session({
        name: "user_session",
        secret: dev.app.sessionSecretKey,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false, maxAge: 60000 }
    })
)

userRouter.get("/all-users", getAllUsers);
userRouter.post("/register", formidable(), registerUser);
userRouter.post("/login", isLoggedOut, loginUser);
userRouter.get("/logout", isLoggedIn, logoutUser);
userRouter.post("/verify-email", verifyEmail);
userRouter.get("/", isLoggedIn, userProfile);
userRouter.put("/", isLoggedIn, formidable(), updateUser);
userRouter.delete("/", isLoggedIn, deleteUser);

module.exports = userRouter;