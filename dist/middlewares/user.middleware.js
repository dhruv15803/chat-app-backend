import jwt from 'jsonwebtoken';
const protectRoute = async (req, res, next) => {
    if (!req.cookies?.accessToken) {
        res.json({
            'success': false,
            "message": "user not logged in",
        });
        return;
    }
    const decodedToken = jwt.verify(req.cookies?.accessToken, process.env.JWT_SECRET);
    if (!decodedToken) {
        res.status(500).json({
            "success": false,
            "message": "cannot verify accessToken",
        });
        return;
    }
    const userId = decodedToken?._id;
    req.userId = userId;
    next();
};
export { protectRoute };
