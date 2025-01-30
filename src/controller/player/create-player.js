const playerServices = require("../../db.services.js/player.service");
const { createPlayerValidation } = require("../../utils/validation/player.validation");
const bcrypt = require("bcrypt");

const createPlayer = async (request, response) => {
  try {
    //extract data from request body
    const { name, email, mobile, dob, userName, password, confirmPassword } = request.body;

    if (!name || !email || !mobile || !dob || !userName || !password || !confirmPassword) {
      const missingFields = [];

      if (!name) missingFields.push("name");
      if (!email) missingFields.push("email");
      if (!mobile) missingFields.push("mobile");
      if (!dob) missingFields.push("dob");
      if (!userName) missingFields.push("userName");
      if (!password) missingFields.push("password");
      if (!confirmPassword) missingFields.push("confirmPassword");

      return response.status(200).json({
        status: "FAILED",
        message: "All fields are required missing fields are " + missingFields,
      });
    }

    
    //check validation
    const validationResult = await createPlayerValidation.validate({ name, email, mobile: mobile?.toString(), dob, password, userName }, { abortEarly: true });
    if (validationResult.error) {
      response.status(200).json({
        status: "FAILED",
        message: validationResult?.error?.details[0]?.message,
      });
      return;
    }
    
    if (password !== confirmPassword) {
      return response.status(200).json({
        status: "FAILED",
        message: "Password and Confirm Password does not match",
      });
    }
    
    //check player already exist with mobile no and email
    const isPlayerExist = await playerServices.getPlayerByEmailAndMobile(
      email,
      mobile
    );
    if (isPlayerExist) {
      response.status(200).json({
        status: "FAILED",
        message: "Player already exist with this email and mobile",
      });
      return;
    }

    //hash password
    const hashPassword = await bcrypt.hash(password, 12);
    
    const dataToInsert = {
      name,
      email,
      mobile,
      dob,
      userName,
      password : hashPassword,
    };

    const player = await playerServices.createPlayer(dataToInsert);
    if (player && player?.dataValues && player?.dataValues?.id) {
      response.status(200).json({
        status: "SUCCESS",
        message: "Player created successfully",
      });
      return;
    } else {
      response.status(200).json({
        status: "FAILED",
        message: "Failed to create player Please try again",
      });
      return;
    }
  } catch (error) {
    console.log("Error while creating player : ", error);

    return response.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
};

module.exports = createPlayer;
