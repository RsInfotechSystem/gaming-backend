const locationServices = require("../../db.services.js/location.service");
const { updateLocationValidation } = require("../../utils/validation/location.validation");


const updateLocation = async (request, response) => {
    try {
        //extract data from request body
        const { locationId, name } = request.body;

        //check validation
        const validationResult = await updateLocationValidation.validate({ locationId, name }, { abortEarly: true });
        if (validationResult.error) {
            response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message
            });
            return;
        };

        //check location exist or not
        const isExist = await locationServices.getLocationById(locationId);
        if (!isExist) {
            return response.status(200).json({
                status: "FAILED",
                message: "Location does not exist"
            });
        };

        //check location is active or not
        if (isExist?.isActive === false) {
            return response.status(200).json({
                status: "FAILED",
                message: "You can not update disable location."
            });
        }

        //check updated location name is not similar to the existing one
        if (!(isExist?.name?.toLowerCase() === name?.toLowerCase())) {
            const isLocationNameExist = await locationServices.getLocationByName(name);
            if (isLocationNameExist) {
                return response.status(200).json({
                    status: "FAILED",
                    message: `${name} location is already exist.`
                });
            };
        };


        const dataToUpdate = {
            name: name?.toLowerCase()
        };

        //update data into db and send response to client
        const result = await locationServices.updateLocationDetails(locationId, dataToUpdate);
        if (result[0] > 0) {
            response.status(200).json({
                status: "SUCCESS",
                message: "Location updated successfully"
            });
            return;
        } else {
            response.status(200).json({
                status: "FAILED",
                message: "Failed to update location"
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


module.exports = updateLocation;