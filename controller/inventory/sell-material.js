const notificationServices = require("../../db.services.js/notification.service");
const stockServices = require("../../db.services.js/stock.service");
const userServices = require("../../db.services.js/user.service");
const { sellMaterialValidation } = require("../../utils/validation/stock.validation");


const sellMaterial = async (request, response) => {
    try {
        //extract data from request
        const { id, name, role } = request;

        //extract data from request body
        const { stockId, quantity } = request.body;

        //check validation
        const validationResult = await sellMaterialValidation.validate({ stockId, quantity }, { abortEarly: true });
        if (validationResult.error) {
            return response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message
            });
        };

        //check stock exist or not
        const isStockExist = await stockServices.getStockById(stockId);
        if (!isStockExist) {
            return response.status(200).json({
                status: "FAILED",
                message: "Stock does not exist"
            })
        };

        //check stock assigned to anyone
        if (isStockExist?.status?.toLowerCase() === "assigned") {
            return response.status(200).json({
                status: "FAILED",
                message: `You can't Sell assigned Material`
            });
        }

        //check the quantity is less than or equal to remaining quantity, User can't sell more that available quantity
        if (quantity > isStockExist?.remainingQuantity) {
            return response.status(200).json({
                status: "FAILED",
                message: `You can't Sell More than available Quantity`
            });
        }


        //update the stock status & add one entry in stock out & sent it for approval toward admin
        const dataToUpdate = {
            status: (Number(isStockExist?.remainingQuantity) === Number(quantity)) ? "stock-out" : isStockExist?.status,
            sellDate: new Date(),
            remainingQuantity: Number(isStockExist?.remainingQuantity) - Number(quantity)
        }

        const dataToInsert = {
            stockId: stockId,
            stockOutBy: id,
            quantity,
            status: "new",
            isApprove: false
        }

        let notification = null;
        if (role === "admin") {
            dataToInsert.status = "approved"
            dataToInsert.isApprove = true
        }
        else {
            //send notification to admin
            //get the admin user
            const adminUser = await userServices.getAdminInfo();
            notification = adminUser.map(ele => ({
                title: `Material Stock Out`,
                createdBy: id,
                notificationFor: ele._id.toString(),
                description: `${name} stock out the material from ${isStockExist.locationId.name}, Please check & approve`,
                isSeen: false
            }))
        }


        //update data into db and send response to client
        const result = await stockServices.updateStockDetail(stockId, dataToUpdate);
        const isStockOut = await stockServices.stockOut(dataToInsert)
        if (notification) {
            await notificationServices.insertNotification(notification);
        }
        if (result[0] > 0) {
            return response.status(200).json({
                status: "SUCCESS",
                message: `Stock stock-out successfully`
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: `Failed to stock out`
            });
        }
    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message
        });
    };
};


module.exports = sellMaterial;