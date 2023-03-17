const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");

// Create Product -- Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    let images = [];

    // trường hợp chỉ thêm 1 ảnh
    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }

    req.body.images = imagesLinks;
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product,
    });
});

// Get All Product
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 8; // số sản phẩm mỗi page
    const productsCount = await Product.countDocuments(); // tính tổng số lượng tất cả Product trong kho

    // req.query = { page: '1' }
    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage);
    const apiFeature2 = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()

    let products = await apiFeature.query;
    // let products2 = await apiFeature2.query;
    // console.log('products.length:', products.length);
    // console.log('products2.length:', products2.length);

    // const productsCount2 = await products.countDocuments(); // tính tổng số lượng tất cả Product trong kho
    // console.log("productsCount2:", productsCount2)

    let filteredProductsCount = products.length; // số dòng khi filter tại trang hiện tại

    // apiFeature.pagination(resultPerPage);

    // products = await apiFeature.query;

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount,
    });
});

// Get All Product (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products,
    });
});

// Get Product Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    if (typeof req.params.id === "string" && req.params.id.length === 24) {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        res.status(200).json({
            success: true,
            product,
        });
    } else {
        return next(new ErrorHandler("Product not found", 404));
    }
});

// Update Product -- Admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    if (typeof req.params.id === "string" && req.params.id.length === 24) {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        // Images Start Here
        let images = [];

        if (typeof req.body.images === "string") {
            images.push(req.body.images);
        } else {
            images = req.body.images;
        }

        if (images !== undefined) {
            // Deleting Images From Cloudinary
            for (let i = 0; i < product.images.length; i++) {
                await cloudinary.v2.uploader.destroy(product.images[i].public_id);
            }

            const imagesLinks = [];

            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.v2.uploader.upload(images[i], {
                    folder: "products",
                });

                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }

            req.body.images = imagesLinks;
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        res.status(200).json({
            success: true,
            product,
        });
    } else {
        return next(new ErrorHandler("Product not found", 404));
    }
});

// Delete Product -- Admin
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    if (typeof req.params.id === "string" && req.params.id.length === 24) {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        await product.remove();

        res.status(200).json({
            success: true,
            message: "Product Delete Successfully",
        });
    } else {
        return next(new ErrorHandler("Product not found", 404));
    }
});


// Create New Review or Update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    // kiểm tra xem user đã có review sản phẩm này chưa
    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
        // Nếu user đã từng reviews thì cập nhật thông tin rating của user đó
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString())
                (rev.rating = rating), (rev.comment = comment);
        });
    } else {
        // Nếu user chưa từng review thì thêm vào product.reviews và cập nhật số lượng reviews
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach((rev) => {
        avg += rev.rating;
    });

    // tính là điểm trung bình rating
    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});

// Get All Reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    if (typeof req.query.id === "string" && req.query.id.length === 24) {
        const product = await Product.findById(req.query.id);

        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        res.status(200).json({
            success: true,
            reviews: product.reviews,
        });
    } else {
        return next(new ErrorHandler("Product not found", 404));
    }
});

// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    if (typeof req.query.productId === "string" && req.query.productId.length === 24) {
        const product = await Product.findById(req.query.productId);

        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        // lọc reviews của product mà loại bỏ sản phẩm với id muốn xóa
        const reviews = product.reviews.filter(
            (rev) => rev._id.toString() !== req.query.id.toString()
        );

        let avg = 0;

        reviews.forEach((rev) => {
            avg += rev.rating;
        });

        let ratings = 0;

        if (reviews.length === 0) {
            ratings = 0;
        } else {
            ratings = avg / reviews.length;
        }

        const numOfReviews = reviews.length;

        // findByIdAndUpdate sẽ cập nhật những trường mà ta truyền vào
        await Product.findByIdAndUpdate(
            req.query.productId,
            {
                reviews,
                ratings,
                numOfReviews,
            },
            {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            }
        );

        res.status(200).json({
            success: true,
        });
    } else {
        return next(new ErrorHandler("Product not found", 404));
    }
});
