const nodemailer = require('nodemailer');
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "mail.rsinfotechsys.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false,
    },
  });

const sendEmail = async (email,dataToSend) => {
        const mailOptions = {
            from: process.env.EMAIL_ID,
            to : email,
            subject: "Request for password reset",
            html : `<h1>Reset Your Password</h1>
                <p>Dear ${dataToSend.name},</p>
                <p>You have requested to reset your password. With User Name ${dataToSend.userName}</p>
                <p>Please click the link below to reset your password:</p>
                <p><a href="${dataToSend.resetUrl}">Reset Password</a></p>
                <p>If you did not request this, please ignore this email.</p>
                <p>Thank you,</p>
                <p>Gaming Platform</p>`,
        };
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log("Email Send Successfully", info);
          } catch (error) {
            console.error("Error Sending Email", error);
          }
};

module.exports = sendEmail;

