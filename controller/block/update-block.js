const blockServices = require("../../db.services.js/block.service");
const locationServices = require("../../db.services.js/location.service");
const { updateBlockValidation } = require("../../utils/validation/block.validation");


const updateBlock = async (request, response) => {
    try {
        //extract data from request body
        const { blockId, locationId, blockNo } = request.body;

        //check validation
        const validationResult = await updateBlockValidation.validate({ blockId, locationId, blockNo }, { abortEarly: true });
        if (validationResult.error) {
            response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message
            });
            return;
        };

        //check block exist or not
        const isExist = await blockServices.getBlockById(blockId);
        if (!isExist) {
            return response.status(200).json({
                status: "FAILED",
                message: "Block does not exist"
            });
        };

        if (isExist?.isDeleted === true) {
            return response.status(200).json({
                status: "FAILED",
                message: "Block does not exist"
            });
        };

        //check location exist or not
        const isLocationExist = await locationServices.getLocationById(locationId);
        if (!isLocationExist) {
            return response.status(200).json({
                status: "FAILED",
                message: "Location does not exist"
            })
        };


        //ensure block no should not be similar to the existing one
        const existingBlock = await blockServices.getExistingBlockByName(blockId, blockNo?.toLowerCase());
        if (existingBlock) {
            response.status(200).json({
                status: "FAILED",
                message: `Block ${blockNo} is already exist.`
            });
            return;
        }


        const dataToUpdate = {
            locationId: locationId.toLowerCase(),
            blockNo: blockNo?.toString()
        };

        //update data into db and send response to client
        const result = await blockServices.updateBlockDetails(blockId, dataToUpdate);
        if (result[0] > 0) {
            response.status(200).json({
                status: "SUCCESS",
                message: "Block details updated successfully"
            });
            return;
        } else {
            response.status(200).json({
                status: "FAILED",
                message: "Failed to update details"
            });
            return;
        };
    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message
        })
    }
};


module.exports = updateBlock;