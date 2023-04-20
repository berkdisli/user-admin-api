const jwt = require('jsonwebtoken');
const fs = require('fs')
let User = require("../model/users")
const { getUniqueId } = require("../helpers/users");
const { generateHashPassword, compareHashPassword } = require("../helpers/securePassword");
const dev = require("../config");
const { sendEmailWithNodeMailer } = require("../helpers/email");
const { errorResponse } = require('../helpers/responseHandler');

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

const updateUser = async (req, res) => {
    try {
        const hashedPassword = await generateHashPassword(req.fields.password)
        const updatedData = await User.findByIdAndUpdate(req.session.userId,
            { ...req.fields, password: hashedPassword },
            { new: true }
        );

        if (!updatedData) {
            return res.status(400).json({
                ok: false,
                message: `the user couldn't be updated`,
                data: updatedData
            });
        }

        if (req.files.image) {
            const { image } = req.files;
            updatedData.image.data = fs.readFileSync(image.path);
            updatedData.image.contentType = image.type;
        }
        await updatedData.save();
        successResponse(res, 200, "the user was successfully updated",
        );
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.session.userId)
        successResponse(res, 200, "the user was deleted successfully",
        );
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password, age, phone } = req.body;
        const { image } = req.file.filename;

        const isExist = await User.findOne({ email: email });
        if (isExist) {
            errorResponse(res, 400, `the user with this email already exists`
            )
        }

        if (!name || !email || !password || !age || !phone) {
            res.status(404).json({
                message: `name, email, age or password is missing`
            });
            return
        }
        if (password.lenght < 6) {
            return res.status(404).json({
                message: `min password length is 6 `
            });
        }


        const secretKey = dev.app.jtwSecretKey
        const hashedPassword = await generateHashPassword(password)
        const token = jwt.sign({ name, email, age, hashedPassword, phone, image }, secretKey, { expiresIn: "10m" });

        //prepare email
        const emailData = {
            email,
            subject: "Account activation email",
            html: `
            <h2>Hello ${name}!</h2>
            <p> Please click here to <a href= "${dev.app.clientURL}/api/users/activate/
            ${token}" target = "_blank"> activate your account </a> </p>
            `
        };
        sendEmailWithNodeMailer(emailData);

        return res.status(201).json({
            token: token,
            message: "A verification link has been sent to your email"
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            errorResponse(res, 400, "email or passowrd not found")
        };

        if (password.length < 8)
            errorResponse(res, 400, "Bad Request: password length is not valid",
            );

        const user = await User.findOne({ email });
        if (!user) {
            errorResponse(res, 400, "Bad Request: user with this email does not exist. Sign up first")
        };

        const isPasswordMatch = await compareHashPassword(password, user.password);

        if (!isPasswordMatch)
            errorResponse(res, 400, "Bad Request: invalid email or password")

        if (user.is_verified === 0) {
            return res.status(401).json({ message: "Unauthorized: please confirm your email first" })
        }
        //creating session => cookie
        req.session.userId = user._id;

        res.status(200).json({ message: `Welcome, ${user.name}!` });
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(404).json({
                message: "token is missing",
            });
        }

        const secretKey = dev.app.jtwSecretKey
        jwt.verify(token, secretKey, async function (err, decoded) {
            if (err) {
                return res.status(401).json({
                    message: "Token is expired",
                })
            }
            const { name, email, hashedPassword, phone, image, age } = decoded;
            const isExist = await User.findOne({ email: email });
            if (isExist)
                errorResponse(res, 400, `the user already exist`
                )

            //create user without image
            const newUser = new User({
                id: await getUniqueId(),
                name: name,
                password: hashedPassword,
                email: email,
                age: age,
                phone: phone,
                is_verified: 1,
            })

            if (image) {
                newUser.image.data = fs.readFileSync(image.path);
                newUser.image.contentType = image.type;
            }

            //save the user
            const user = await newUser.save()
            if (!user) {
                errorResponse(res, 400, `the user was not created`
                )
            }

            successResponse(res, 200, "the user was created and ready to sign in",
            );
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const logoutUser = async (req, res) => {
    try {
        req.session.destroy();
        res.clearCookie("user_session");
        res.status(200).json({ message: "Log out is successfull" });
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

const userProfile = async (req, res) => {
    try {
        const userData = await User.findById(req.session.userId)
        return res.status(200).json({
            ok: true,
            message: "user profile",
            user: userData
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

const forgetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(404).json({
                message: ` email or password is missing`
            });
            return
        }
        if (password.lenght < 6) {
            return res.status(404).json({
                message: `min password length is 6 `
            });
        }

        const user = await User.findOne({ email: email });
        if (!user) errorResponse(res, 400, `a user wasn't found with this email address `
        );

        const secretKey = dev.app.jtwSecretKey
        const hashedPassword = await generateHashPassword(password)
        const token = jwt.sign({ email, hashedPassword }, secretKey, { expiresIn: "10m" });

        //prepare email
        const emailData = {
            email,
            subject: "Reset your password",
            html: `
            <h2>Hello ${user.name}!</h2>
            <p> Please click here to <a href= "${dev.app.clientURL}/api/users/reset-password/
            ${token}" target = "_blank"> Reset your password </a> </p>
            `
        };
        sendEmailWithNodeMailer(emailData);

        return res.status(200).json({
            message: "An email has been sent to reset your password",
            token: token
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(404).json({
                message: "Token is missing",
            });
        }

        const secretKey = dev.app.jtwSecretKey
        jwt.verify(token, secretKey, async function (err, decoded) {
            if (err) {
                return res.status(401).json({
                    message: "Token is expired",
                })
            }

            const { email, hashedPassword } = decoded;
            const isExist = await User.findOne({ email: email });
            if (!isExist)
                errorResponse(res, 400, `the user with this email doesn't exist`
                )

            //update data
            const updateData = await User.updateOne({ email: email },
                {
                    $set: {
                        password: hashedPassword
                    }
                })

            if (!updateData) {
                errorResponse(res, 400, `reset password process is not successfull `,
                );
            }

            successResponse(res, 200, "your new password is successfully updated ",
            );
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

module.exports = { getAllUsers, updateUser, deleteUser, registerUser, loginUser, verifyEmail, logoutUser, userProfile, forgetPassword, resetPassword }