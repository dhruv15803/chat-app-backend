import jwt from 'jsonwebtoken';
const generateTokenAndSetCookies = (user, res) => {
    const token = jwt.sign({
        _id: user._id,
    }, process.env.JWT_SECRET);
    res.cookie('accessToken', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        secure: true,
    });
};
export default generateTokenAndSetCookies;
