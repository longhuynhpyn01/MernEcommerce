const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        service: process.env.SMPT_SERVICE,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.SMPT_MAIL, // email người gửi
        to: options.email, // email người nhận
        subject: options.subject, // Tên tiêu đề
        text: options.message, // nội dung tin nhắn
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
