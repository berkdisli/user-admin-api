const mongoose = require("mongoose");
const validateEmail = (email) => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const usersSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: [true, "name is required"],
        minLength: [2],
        trim: true
    },
    age: {
        type: Number,
        required: [true, "age is required"],
    },
    phone: {
        type: Number,
        required: [true, "phone is required"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
        trim: true,
        unique: true,
        lowercase: true,
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        minlength: [8, "min length of the password is 8"],
        required: [true, "password is required"]
    },
    is_admin: {
        type: Number,
        default: 0
    },
    is_verified: {
        type: Number,
        default: 0
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
        default: "../../public/images/1681998504104-portfolio.png",
    },
    isBanned: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true }
)

const User = mongoose.model("Users", usersSchema)
module.exports = User; 