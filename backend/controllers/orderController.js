const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create new Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(201).json({
        success: true,
        order,
    });
});

// get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    if (typeof req.params.id === "string" && req.params.id.length === 24) {
        const order = await Order.findById(req.params.id).populate(
            "user",
            "name email"
        ); // sử dụng populate để lấy ra thông tin chi tiết user được ref đến nhưng chỉ lấy thêm 2 giá trị name, email

        if (!order) {
            return next(new ErrorHandler("Order not found with this Id", 404));
        }

        res.status(200).json({
            success: true,
            order,
        });
    } else {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }
});

// get logged in user  Orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        orders,
    });
});

// get all Orders -- Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    });
});

// cập nhật số lượng sản phẩm này trong kho
async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    product.Stock -= quantity; // cập nhật quantity của product trong model
    // có nên xét điều kiện nếu Stock = 0 thì không thể giao do hết hàng

    await product.save({ validateBeforeSave: false });
}

// update Order Status -- Admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    if (typeof req.params.id === "string" && req.params.id.length === 24) {
        const order = await Order.findById(req.params.id); // id của đơn hàng

        if (!order) {
            return next(new ErrorHandler("Order not found with this Id", 404));
        }

        // Nếu trạng thái là đã giao hàng thì thông báo lỗi sản phẩm đã được giao
        if (order.orderStatus === "Delivered") {
            return next(new ErrorHandler("You have already delivered this order", 400));
        }

        // Nếu trạng thái muốn cập nhật thành đang giao hàng thì thực hiện thay đổi về số lượng sản phẩm còn lại trong cửa hàng
        if (req.body.status === "Shipped") {
            // duyệt tất cả sản phẩm trong đơn hàng
            order.orderItems.forEach(async (o) => {
                await updateStock(o.product, o.quantity);
            });
        }
        order.orderStatus = req.body.status; // cập nhật trạng thái đơn hàng

        // Nếu trạng thái muốn cập nhật thành đã giao hàng thì lấy ngày hiện tại cập nhật thành ngày giao hàng
        if (req.body.status === "Delivered") {
            order.deliveredAt = Date.now();
        }

        await order.save({ validateBeforeSave: false });
        res.status(200).json({
            success: true,
        });
    } else {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }
});

// delete Order -- Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    if (typeof req.params.id === "string" && req.params.id.length === 24) {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return next(new ErrorHandler("Order not found with this Id", 404));
        }

        await order.remove();

        res.status(200).json({
            success: true,
        });
    } else {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }
});
