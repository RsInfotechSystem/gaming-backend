const blockServices = require("../../db.services.js/block.service");
const locationServices = require("../../db.services.js/location.service");
const { blockValidation } = require("../../utils/validation/block.validation");


const createBlock = async (request, response) => {
    try {
        //extract data from request body
        const { locationId, blockNo } = request.body;

        //check validation
        const validationResult = await blockValidation.validate({ locationId, blockNo }, { abortEarly: true });
        if (validationResult.error) {
            response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message,
            });
            return;
        }

        //check block already exist 
        const isBlockExist = await blockServices.getBlockByBlockNo(blockNo)
        if (isBlockExist) {
            response.status(200).json({
                status: "FAILED",
                message: "Block already exists with this block number."
            });
            return;
        };

        //check location exist or not
        const isLocationExist = await locationServices.getLocationById(locationId);
        if (!isLocationExist) {
            return response.status(200).json({
                status: "FAILED",
                message: "Location does not exist"
            })
        };

        const dataToInsert = {
            locationId,
            blockNo: blockNo?.toLowerCase(),
            isDeleted: false
        }

        //insert data into db & send response to client
        const result = await blockServices.createBlock(dataToInsert);
        if (result && result.dataValues && result.dataValues.id) {
            response.status(200).json({
                status: "SUCCESS",
                message: "Block added successfully",
            });
            return;
        } else {
            response.status(200).json({
                status: "FAILED",
                message: "Failed to add block, Please try again!",
            });
            return;
        };
    } catch (error) {
        response.status(500).json({
            status: "FAILED",
            message: error.message,
        });
        return;
    }
};


module.exports = createBlock;