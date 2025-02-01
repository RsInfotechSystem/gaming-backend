const jwt = require('jsonwebtoken');
const userServices = require('../../db.services.js/user.service');
const playerServices = require('../../db.services.js/player.service');

const authenticatePlayerJWT = async (request, response, next) => {
    try {
        const authHeader = request.header('authorization');
        if (authHeader) {
            const token = authHeader.split(' ')[1];

            jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, playerObject) => {
                if (err) {
                    response.status(200).json({
                        status: "JWT_INVALID",
                        message: "Your session has ended. Please login again."
                    });
                    return;
                } else {
                    request.email = playerObject?.email;

                    // check if user exists
                    const doesPlayerExist = await playerServices.getPlayerByEmail(playerObject?.email)
                    if (!doesPlayerExist) {
                        response.status(200).json({
                            status: "JWT_INVALID",
                            message: "Your session has ended. Please login again."
                        });
                        return;
                    }
                    request.mobile = doesPlayerExist?.mobile;
                    request.id = doesPlayerExist?.id;
                    request.name = doesPlayerExist.name;
                    request.email = doesPlayerExist?.email;
                    // request.isActive = doesPlayerExist?.isActive;
                    // request.role = doesPlayerExist?.role?.name;
                    // request.isDeleted = doesPlayerExist?.isDeleted;
                    // request.locationId = doesPlayerExist?.locationId;
                }
                next();
            });
        } else {
            response.status(200).json({
                status: "JWT_INVALID",
                message: "Your session has ended. Please login again."
            });
            return;
        }
    } catch (error) {
        response.status(500).json({
            status: "FAILED",
            message: error.message
        });
        return;
    }
};


module.exports = authenticatePlayerJWT;