const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401));
    }

    // lấy ra id lưu trong jwt
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    // decodedData: { id: '635aa88f6ec194b65093cad8', iat: 1668011179, exp: 1668443179 }

    req.user = await User.findById(decodedData.id);

    next();
});

// ...roles trở thành format ["admin"]
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role: ${req.user.role} is not allowed to access this resouce `,
                    403
                )
            );
        }

        next();
    };
};
