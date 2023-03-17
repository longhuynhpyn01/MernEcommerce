// xây dựng lớp để giải quyết các tính năng khác khi truyền api
class ApiFeatures {
    // http://localhost:4000/api/v1/products?keyword=samosa
    // query ở url trên chính là sau dấu ?, tức query chính là keyword=samosa 
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    // phương thức tìm kiếm
    search() {
        // queryStr: { keyword: 'samosa' }
        // keyword: { name: { '$regex': 'samosa', '$options': 'i' } }
        const keyword = this.queryStr.keyword
            ? {
                name: {
                    $regex: this.queryStr.keyword,
                    $options: "i",
                },
            }
            : {};

        // lúc này tương đương với await Product.find({ name: 'samosa'});
        this.query = this.query.find({ ...keyword });
        return this;
    }

    // phương thức lọc
    filter() {
        const queryCopy = { ...this.queryStr };
        //   Removing some fields for category
        const removeFields = ["keyword", "page", "limit"];

        // xóa bỏ các trường có key cần xóa như trên (trường mang ý nghĩa nhất định)
        removeFields.forEach((key) => delete queryCopy[key]);

        // Filter For Price and Rating
        // http://localhost:4000/api/v1/products?keyword=product&category=Laptop&price[gt]=1200&price[lt]=2000
        // lọc theo name là product1, category là Laptop, 1200 < price < 2000 
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`); // để lọc cho price có gt lớn hay nhỏ hơn
        // {"category":"Laptop","price":{"$gt":"1200","$lt":"2000"}}

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    // phương thức phân trang
    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;

        const skip = resultPerPage * (currentPage - 1); // ví dụ trang 1 => bỏ đi 0, trang 2 bỏ đi 8 kq đầu

        this.query = this.query.limit(resultPerPage).skip(skip);

        return this;
    }
}

module.exports = ApiFeatures;
