const playerServices = require("../../db.services.js/player.service");
const {loginPlayerValidation} = require("../../utils/validation/player.validation");
const generateUserJWT = require("../../utils/middleware/generate-token");

const loginPlayer = async (request, response) => {
  try {
    //extract data from request body
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(200).json({
        status: "FAILED",
        message: "Email and password are required",
        }); 
    }

    //check validation
    const validationResult = await loginPlayerValidation.validate(
      { email, password },
      { abortEarly: true }
    );
    if (validationResult.error) {
      response.status(200).json({
        status: "FAILED",
        message: validationResult?.error?.details[0]?.message,
      });
      return;
    }

    //check player already exist or not
    const isPlayerExist = await playerServices.getPlayerByEmail(email);
    if (!isPlayerExist) {
      return response.status(200).json({
        status: "FAILED",
        message: "Player does not exist",
      });
    }

    //Check if player is active or not
    if (isPlayerExist?.isActive === false) {
      return response.status(200).json({
        status: "FAILED",
        message: "You can not login disable player",
      });
    }

    if (isPlayerExist.password == password) {
        const token = generateUserJWT(isPlayerExist.id, isPlayerExist.name, isPlayerExist?.email, isPlayerExist?.mobile, isPlayerExist?.dob, isPlayerExist?.userName);
        if (token) {
          return response.status(200).json({
            status: "SUCCESS",
            message: "Player login successfully",
            token,
            userDetails: isPlayerExist,
          });
        }
    }else{
        return response.status(200).json({
            status: "FAILED",
            message: "Incorrect password",
        });
    }
    return response.status(200).json({
      status: "SUCCESS",
      message: "Player login successfully",
    });

  } catch (error) {
    console.log("Error while creating player : ", error);
    return response.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
};

module.exports = loginPlayer;