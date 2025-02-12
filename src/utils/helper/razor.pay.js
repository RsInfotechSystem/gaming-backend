const Razorpay = require('razorpay');
const dotenv = require("dotenv");
dotenv.config();

async function getPaymentDetails() {
    const key_Id = process.env.RAZOR_PAY_KEY_ID
    const secret_Key = process.env.RAZOR_PAY_SECRET_KEY

    const instance = new Razorpay({ key_id: key_Id, key_secret: secret_Key })
    return instance
};

module.exports = getPaymentDetails