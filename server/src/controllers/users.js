const jwt = require('jsonwebtoken');
let User = require("../model/users")
const { getUniqueId } = require("../helpers/users");
const { generateHashPassword } = require("../helpers/securePassword");
const dev = require("../config/users")

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json({
            message: "all users returned",
            users: users
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

const getSingleUser = async (req, res) => {
    try {
        const singleUser = await User.findOne({ id: req.params.id });
        if (!singleUser) {
            return res.status(404).json({
                message: `no user was found with an id`
            })
        }
        return res.status(200).json({
            message: "a user was returned",
            user: singleUser,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const addUser = async (req, res) => {
    try {
        const isExist = await User.findOne({ email: req.body.email });
        if (isExist)
            return res.status(400).json({
                message: `the user already exist`
            })

        const newUser = new User({
            id: await getUniqueId(),
            name: req.body.name,
            email: req.body.email,
            age: req.body.age,
            phone: req.body.phone,
            password: await generateHashPassword(req.body.password)
        });
        const user = await newUser.save();
        if (!user)
            return res.status(400).json({
                message: "user was not created"
            });

        return res.status(201).json({
            message: "user was created"
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.id });
        console.log(user);
        if (!user) {
            return res.status(400).json({
                message: `the user couldn't be found`
            });
        }
        const updateTheUser = await User.updateOne(
            { id: req.params.id },
            {
                $set: {
                    name: req.body.name,
                    email: req.body.email,
                    age: req.body.age,
                    password: req.body.password,
                    phone: req.body.phone
                }
            }
        );
        if (!updateTheUser) {
            return res.status(400).json({
                message: `the user couldn't be updated`,
            });
        }
        return res.status(200).json({
            message: "a user was updated",
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        await User.deleteOne({ id: req.params.id })
        return res.status(200).json({
            message: "a user was deleted",
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password, age, phone } = req.fields;
        const { image } = req.files;

        if (!name || !email || !password || !age || !phone) {
            return res.status(404).json({
                message: `name, email, age or password is missing`
            });
        }
        if (password.lenght < 6) {
            return res.status(404).json({
                message: `min password lenghth is 6 `
            });
        }
        if (image && image.size > 1000000) {
            return res.status(404).json({
                message: `max size of image is 1mb `
            });
        }

        const isExist = await User.findOne({ email: email });
        if (isExist) {
            return res.status(400).json({
                message: `the user with this email already exists`
            })
        }
        const secretKey = dev.app.jtwSecretKey
        const hashedPassword = await generateHashPassword(password)
        const token = jwt.sign({ name, email, age, hashedPassword, phone, image }, secretKey, { expiresIn: "10m" });

        return res.status(201).json({
            token: token,
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

module.exports = { getAllUsers, getSingleUser, addUser, updateUser, deleteUser, registerUser }