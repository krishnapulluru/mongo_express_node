const mongoose = require("mongoose");
const validator = require("validator");
const bcript = require("bcryptjs");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name must required to create a user'],
        trim: true,
        maxlength: [150, ' A user name must have less then 150 characters'],
        minlength: [3, 'A user name must have at least 3 characters']
    },
    email: {
        type: String,
        required: [true, "Email must required to create a user"],
        trim: true,
        unique: true,
        validate: [validator.isEmail, 'Please provide valid email']

    },
    profileImg: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true,
        required: [true, "Please provide a password"],
        minlength: 8,
        maxlength: 36,
        select: false
    },
    passwordConfirm: {
        type: String,
        trim: true,
        required: [true, "Please confirm your password"],
        validate: {
            validator: function (pass) {
                return pass === this.password
            }
        }
    }

})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcript.hash(this.password, 12)
    this.passwordConfirm = undefined;
    next();
})


userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcript.compare(candidatePassword, userPassword)
}

const User = mongoose.model("User", userSchema);

module.exports = User;