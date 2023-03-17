const dotenv = require("dotenv");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
// được thêm để có middleware để upload file
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

// thêm khi deployment
const path = require("path");


// Config
dotenv.config({ path: "config/config.env" });


const errorMiddleware = require("./middleware/error");

app.use(express.json()); // chuyển thành json của body
// app.use(express.json({ limit: "50mb" }));
app.use(cookieParser()); // để sử dụng res.cookie
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(fileUpload());

// Route Imports
const productRouter = require("./routes/productRoute");
const userRouter = require("./routes/userRoute");
const orderRouter = require("./routes/orderRoute");
const paymentRouter = require("./routes/paymentRoute");

app.use("/api/v1", productRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", orderRouter);
app.use("/api/v1", paymentRouter);

// thêm khi chuẩn bị deployment
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});
//


// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;


// Bạn CẦN express.json() và express.urlencoded() đối với các yêu cầu POST và PUT, bởi vì trong cả hai yêu cầu này,
// bạn đang gửi dữ liệu (dưới dạng một số đối tượng dữ liệu) đến máy chủ và bạn đang yêu cầu máy chủ chấp nhận hoặc lưu trữ dữ liệu đó
// (đối tượng), được bao gồm trong nội dung (tức là req.body) của Yêu cầu đó (POST hoặc PUT)


// a. express.json()
// là một phương thức được tích hợp sẵn để nhận ra Đối tượng Yêu cầu đến là một Đối tượng JSON.
// Phương thức này được gọi là phần mềm trung gian trong ứng dụng của bạn bằng cách sử dụng mã:app.use(express.json());

// b. express.urlencoded()là một phương thức được xây dựng sẵn để nhận ra Đối tượng Yêu cầu đến dưới dạng chuỗi hoặc mảng.
// Phương thức này được gọi là phần mềm trung gian trong ứng dụng của bạn bằng cách sử dụng mã:app.use(express.urlencoded());


// Bạn nên sử dụng body-parser (nó là một gói NPM) để làm điều tương tự. Nó được phát triển bởi chính những người đã xây dựng
// express và được thiết kế để hoạt động với express. body-parser từng là một phần của express. Hãy nghĩ về phân tích cú pháp
// nội dung cụ thể cho Yêu cầu POST (tức là đối tượng yêu cầu .post) và / hoặc Yêu cầu PUT (tức là đối tượng yêu cầu .put).
