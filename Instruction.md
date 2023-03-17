-   npm i express mongoose dotenv
-   npm install --save-dev nodemon
-   npm i bcryptjs jsonwebtoken validator nodemailer cookie-parser body-parser
-   npm i express-fileupload cloudinary => để giúp upload ảnh
-   npm i stripe => để quản lí việc thanh toán


*   frontend

-   npm i axios react-alert react-alert-template-basic react-helmet react-redux redux redux-thunk redux-devtools-extension react-router-dom overlay-navbar
-   npm i node-sass --save
-   npm i react-icons@4.2.0 => để sử dụng icon
-   npm i webfontloader => trình tải font chữ

-   npm i react-helmet => dùng để quản lí thay đổi ở thẻ head
-   npm i react-alert react-alert-template-basic => dùng để đưa ra cảnh báo
    => lên trang bennettfeely.com/dippy để tạo các hình polygon
-   npm i react-material-ui-carousel =>
-   npm i react-js-pagination => để phân trang
-   npm i country-state-city => để lấy API thành phố

-   npm install @stripe/react-stripe-js @stripe/stripe-js => để sử dụng stripe bên trong frontend ReactJS
-   npm i @material-ui/data-grid => dùng để dùng table có mở rộng dạng lưới
-   npm install --save chart.js@^3.5.1 react-chartjs-2@^3.0.4 => sử dụng chart.js và react-chartjs-2 ở phiên bản v3 chứ v4, v5 yêu cầu
type module nên không sử dụng được


-   Sử dụng stripe để quản lí dashboard
=> https://dashboard.stripe.com/test/dashboard
=> https://stripe.com/docs/testing
=> Always authenticate:	4000002760003184

*   Thêm "proxy": "http://192.168.29.21:4000" tại frontend/package.json
    => Để yêu cầu máy chủ phát triển proxy bất kỳ yêu cầu không xác định nào đến máy chủ API của bạn đang phát triển, hãy thêm trường proxy vào package.json của bạn
    => Bằng cách này, khi bạn fetch('/api/todos') trong môi trường development, server development sẽ nhận ra rằng đó không phải là asset tĩnh và sẽ ủy quyền yêu cầu của bạn đối với http://192.168.29.21:4000/api/todos như một sự dự phòng. Server development sẽ chỉ cố gắng gửi các yêu cầu mà không cần văn bản/HTML trong tiêu đề chấp nhận của mình cho proxy.
    => Hãy nhớ rằng proxy chỉ có hiệu lực trong môi trường development (với NPM start) và tùy thuộc vào bạn để đảm bảo rằng các URL như /API/Todos chỉ ra điều đúng trong môi trường production. Bạn không phải sử dụng tiền tố /API. Bất kỳ yêu cầu không được công nhận nào mà không có tiêu đề văn bản/HTML chấp nhận sẽ được chuyển hướng đến.




