const jwt = require("jsonwebtoken");

const User = require("./../models/userModel");
const ac = require("./../utils/catchError");
const AppError = require("./../utils/appError");

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

exports.signUp = ac(async (req, res, next) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        profileImg: req.body.profileImg
    });

    const token = signToken(user._id)

    res.status(201).json({
        status: "success",
        token,
        data: {
            user
        }
    })
})

exports.login = ac(async (req, res, next) => {
    const { email, password } = req.body; 1690745149

    if (!email || !password) {
        return next(new AppError("Please provide email and password for login", 400))
    }


    const user = await User.findOne({ email }).select("+password")
    if (!user || !await user.correctPassword(password, user.password)) return next(new AppError("Given email or password is incorrect", 401))

    const token = signToken(user._id)

    res.status(200).json({
        status: "success",
        token
    }
    )
})