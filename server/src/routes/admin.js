const adminRouter = require("express").Router();
const session = require("express-session");
const { isLoggedIn, isLoggedOut } = require("../middlewares/auth");
const dev = require("../config/index");

const { loginAdmin, logoutAdmin, updateUserByAdmin, deleteUserbyAdmin } = require("../controllers/admin");
const isAdmin = require("../middlewares/isAdmin");
const { registerUser, getAllUsers } = require("../controllers/users");
const upload = require("../middlewares/upload");

adminRouter.use(
    session({
        name: "admin-session",
        secret: dev.app.sessionSecretKey,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 },
    })
);
adminRouter.post("/login", isLoggedOut, loginAdmin);
adminRouter.get("/logout", isLoggedIn, logoutAdmin);
adminRouter.get("/dashboard", isLoggedIn, getAllUsers);
adminRouter.post("/register", upload.single("image"), registerUser);
adminRouter.put("/dashboard/:id", isLoggedIn, isAdmin, upload.single("image"), updateUserByAdmin);
adminRouter.delete("/dashboard/:id", isLoggedIn, isAdmin, deleteUserbyAdmin);

module.exports = adminRouter;