const locationServices = require("../../db.services.js/location.service");
const userServices = require("../../db.services.js/user.service");


const getLocationWiseUser = async (request, response) => {
    try {
        const { locationId } = request.body;

        //check location already exist 
        const isLocationExist = await locationServices.getLocationById(locationId)
        if (!isLocationExist) {
            response.status(200).json({
                status: "FAILED",
                message: "Location not exist",
            });
            return;
        }

        //get location wise users from db and send response to client
        const users = await userServices.getLocationWiseUser(locationId);
        if (users?.length > 0) {
            return response.status(200).json({
                status: "SUCCESS",
                message: "Users fetched successfully",
                users
            })
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "User not available."
            })
        }
    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message
        })
    }
};


module.exports = getLocationWiseUser;