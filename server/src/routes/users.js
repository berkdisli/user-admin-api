const express = require("express");
const formidable = require("express-formidable")
const { getAllUsers, updateUser, deleteUser, registerUser, loginUser, verifyEmail, logoutUser } = require("../controllers/users");
const router = express.Router();

router.get("/", getAllUsers);
router.post("/register", formidable(), registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.post("/verify-email", verifyEmail);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;