const { generateHashPassword, compareHashPassword } = require("../helpers/securePassword");
const User = require("../model/users");

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(404).json({
                message: " email or password is missing",
            });
        }
        if (password.length < 6) {
            res.status(404).json({
                message: "minimum length for password is 6 characters",
            });
        }
        const user = await User.findOne({ email: email });
        if (!user) {
            res.status(400).json({
                message: "user with this email does not exist, please register first",
            });
        }
        if (user.is_admin === 0) {
            return res.status(400).json({
                message: "user is not an admin",
            });
        }
        const isPasswordMatch = await compareHashPassword(password, user.password);
        if (!isPasswordMatch) {
            res.status(400).json({
                message: "email/password does not match",
            });
        }
        req.session.userId = user._id;

        res.status(200).json({
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                image: user.image,
            },
            message: "login successful",
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};
const logoutAdmin = (req, res) => {
    try {
        req.session.destroy();
        res.clearCookie("admin-session");
        res.status(200).json({
            message: "logout successful",
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const getAllusers = async (req, res) => {
    try {
        let search = req.query.search ? req.query.search : "";
        const { page = 1, limit = 2 } = req.query;
        const users = await User.find({
            is_admin: 0,
            $or: [
                { name: { $regex: ".*" + search + ".*", $options: "i" } },
                { email: { $regex: ".*" + search + ".*", $options: "i" } },
                { phone: { $regex: ".*" + search + ".*", $options: "i" } },
                { age: { $regex: ".*" + search + ".*", $options: "i" } },
            ],
        })
            .sort({ name: 1 })
            .limit(limit)
            .skip((page - 1) * limit);

        const count = await User.find({ is_admin: 0 }).countDocuments();

        res.status(200).json({
            message: "return all users",
            total: count,
            users: users,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

const updateUserByAdmin = async (req, res) => {
    try {
        const hashedPassword = await generateHashPassword(req.body.password);
        const userData = await User.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                password: hashedPassword,
                image: req.file,
            },
            { new: true }
        );
        if (!userData) {
            res.status(400).json({
                message: "User was not updated",
            });
        }
        await userData.save();
        res.status(200).json({
            message: "User was updated by Admin",
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

const deleteUserbyAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const users = await User.findById(id);
        if (!users) {
            return res.status(404).json({
                message: "user was not found with this id",
            });
        }
        await User.findByIdAndDelete(id);
        res.status(200).json({
            message: "User was deleted by admin",
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

module.exports = { loginAdmin, logoutAdmin, updateUserByAdmin, deleteUserbyAdmin, getAllusers };