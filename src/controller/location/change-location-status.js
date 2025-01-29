const locationServices = require("../../db.services.js/location.service");
const { idValidation } = require("../../utils/validation/role.validation");


const changeLocationStatus = async (request, response) => {
    try {
        //extract data from request body
        const { locationId } = request.body;

        //check validation
        const validationResult = await idValidation.validate({ id:locationId }, { abortEarly: true });
        if (validationResult.error) {
            response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message
            });
            return;
        };

        //check rack exist or not
        const isExist = await locationServices.getLocationById(locationId);
        if (!isExist) {
            return response.status(200).json({
                status: "FAILED",
                message: "Location does not exist."
            })
        };

        const status = isExist.isActive === true ? 'disable' : "enable";


        //!Don't remove this check
        // if (status?.toLowerCase() === "disable") {
        //     //check block is in used or not
        //     const isLocationUsed = await locationServices.checkLocationIsInUsed(locationId)
        //     if (isLocationUsed?.blockResult?.length > 0 || isLocationUsed?.stockResult?.length > 0 || isLocationUsed?.userResult?.length > 0) {
        //         return response.status(200).json({
        //             status: "FAILED",
        //             message: `${isExist?.name} location is in use, it cannot be disabled.`
        //         })
        //     }
        // }

        const dataToUpdate = {
            isActive: !isExist.isActive
        };

        //update data into db and send response to client
        const result = await locationServices.updateLocationDetails(locationId, dataToUpdate);
        if (result[0] > 0) {
            response.status(200).json({
                status: "SUCCESS",
                message: `Location mark as ${status} successfully`
            });
            return;
        } else {
            response.status(200).json({
                status: "FAILED",
                message: `Failed to mark location as ${status}`
            });
            return;
        }
    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message
        });
    };
};

module.exports = changeLocationStatus;