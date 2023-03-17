// Lớp được xây dựng để báo lỗi (tên lỗi, mã code) khi call api 
class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
};

module.exports = ErrorHandler;
