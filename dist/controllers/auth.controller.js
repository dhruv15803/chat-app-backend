import bcrypt from 'bcrypt';
import { User } from "../models/user.model.js";
import generateTokenAndSetCookies from "../utils/generateToken.js";
const registerUser = async (req, res) => {
    try {
        if (req.cookies?.accessToken) {
            res.status(400).json({
                "success": false,
                "message": "user is already logged in"
            });
            return;
        }
        const { email, password, username, avatarUrl } = req.body;
        if (email.trim() === "" || password.trim() === "" || username.trim() === "") {
            res.status(400).json({
                "success": false,
                "message": "please enter all required fields",
            });
            return;
        }
        // hash password
        // user with either above username and email should not exist,
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // checking if user with above email or username exists
        const isExistingUser = await User.findOne({ $or: [{ email: email.trim().toLowerCase() }, { username: username.trim().toLowerCase() }] });
        if (isExistingUser) {
            res.status(400).json({
                "success": false,
                "message": "user with this username or email already exists",
            });
            return;
        }
        // if no existing user , inserting user in db
        const newUser = await User.create({ email: email.trim().toLowerCase(), password: hashedPassword, username: username.trim().toLowerCase(), avatar: avatarUrl });
        // user created
        // generate jwt token and set cookies
        generateTokenAndSetCookies(newUser, res);
        res.status(201).json({
            "success": true,
            "message": "user successfully registered",
            newUser,
        });
    }
    catch (error) {
        console.log(error);
    }
};
const loginUser = async (req, res) => {
    try {
        if (req.cookies?.accessToken) {
            res.status(400).json({
                "success": false,
                "message": "user is already logged in"
            });
            return;
        }
        const { email, password } = req.body;
        // for user to login , email and password should be correct , above password is in plaintext
        // checking if user with above email exists in database , if exists -> good ELSE BAD
        const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user) {
            res.status(400).json({
                "success": false,
                "message": "incorrect email or password",
            });
            return;
        }
        // if here then user exists and email is correct
        const hashedPassword = user.password;
        const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
        if (!isPasswordCorrect) {
            res.status(400).json({
                "success": false,
                "message": "incorrect email or password",
            });
            return;
        }
        // if here then email and password both correct
        // SO GENERATE TOKEN AND SET COOKIE
        generateTokenAndSetCookies(user, res);
        res.status(200).json({
            "success": true,
            "message": "user succesfully logged in",
            user,
        });
    }
    catch (error) {
        console.log(error);
    }
};
const logoutUser = async (req, res) => {
    // need to be logged in to logout
    if (!req.cookies?.accessToken) {
        res.status(400).json({
            "success": false,
            "message": "user is not logged in",
        });
        return;
    }
    console.log(req.cookies);
    // if here then logged in
    res.clearCookie('accessToken').json({
        "success": true,
        "message": "user successfully logged out"
    });
};
export { registerUser, loginUser, logoutUser, };
