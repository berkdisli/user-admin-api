const express = require("express");
const session = require("express-session");
const { getAllUsers, updateUser, deleteUser, registerUser, loginUser, verifyEmail, userProfile, logoutUser, forgetPassword, resetPassword } = require("../controllers/users");
const { isLoggedIn, isLoggedOut } = require("../middlewares/auth");
const userRouter = express.Router();
const dev = require("../config");
const upload = require("../../src/middlewares/upload")

userRouter.use(
    session({
        name: "user_session",
        secret: dev.app.sessionSecretKey,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false, maxAge: 60000 }
    })
)

userRouter.route("/")
    .get(isLoggedIn, userProfile)
    .put(isLoggedIn, upload.single("image"), updateUser)
    .delete(isLoggedIn, deleteUser);

userRouter.get("/all-users", getAllUsers);
userRouter.post("/register", upload.single("image"), registerUser);
userRouter.post("/login", isLoggedOut, loginUser);
userRouter.get("/logout", isLoggedIn, logoutUser);
userRouter.post("/verify-email", verifyEmail);
userRouter.post("/forget-password", forgetPassword);
userRouter.post("/reset-password", resetPassword);

module.exports = userRouter;