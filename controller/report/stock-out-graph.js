const stockServices = require("../../db.services.js/stock.service");
const getLast15Days = require("../../utils/helper/generate-last-15-days-date");
const monthNames = require("../../utils/helper/month-array");


const stockOutGraph = async (request, response) => {
    try {
        //extract data from request body
        const { startDate, endDate } = request.body;

        //get data from db & send response to client
        const data = await stockServices.getStockOutMaterialCount(startDate, endDate);
        const dateArray = getLast15Days(startDate, endDate);
        const output = [];

        for (let i = 0; i < dateArray.length; i++) {
            const date = dateArray[i];
            const filterData = data?.filter((ele) => (ele._id.year === date.year && ele._id.month === date.month && ele._id.day === date.day));
            output.push({
                label: `${date.day} ${monthNames[date.month]}`,
                count: filterData.length > 0 ? filterData[0].count : 0,
                reportDate: `${date.day} ${monthNames[date.month]} ${date.year}`
            });
        };

        if (output?.length > 0) {
            return response.status(200).json({
                status: "SUCCESS",
                message: "Stock out report fetch successfully",
                report: output
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "Stock out report not available",
            });
        }
    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message
        })
    }
};


module.exports = stockOutGraph