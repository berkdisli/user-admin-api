const express = require("express");
const { body, validationResult } = require('express-validator');
const formidable = require("express-formidable")
const { getAllUsers, getSingleUser, addUser, updateUser, deleteUser, registerUser, loginUser, verifyEmail } = require("../controllers/users");
const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getSingleUser);
router.post("/", body('name').trim().isLength({ min: 2 }).withMessage("minimum length of name is 2 characters"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }, addUser);
router.post("/register", formidable(), registerUser);
router.post("/login", loginUser);
router.post("/verify-email", verifyEmail);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;