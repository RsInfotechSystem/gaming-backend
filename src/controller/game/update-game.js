const gameServices = require("../../db.services.js/game.service");
const runMiddleware = require("../../utils/helper/multer.middleware");
const { uploadImg } = require("../../utils/multer/upload.img");
const {
  updateGameValidation,
} = require("../../utils/validation/game.validation");

const updateGame = async (request, response) => {
  try {
    const { isFileAttached } = request.query;

    const { id } = request;
    const gameDetails = null;

    if (isFileAttached === "true") {
      //Upload image file using multer
      const file = await runMiddleware(request, response, uploadImg.array("gamefiles", 10));
      if (file) {
        response.status(200).json({
          status: "FAILED",
          message: file?.code,
        });
        return;
      }
      gameDetails = JSON.parse(request.body.gameDetails);
    } else {
      gameDetails = request.body;
    }


    //extract data from request body
    const { gameId, name, description, title, oldGameFiles } = gameDetails;

    //check validation
    const validationResult = await updateGameValidation.validate(
      { gameId, name, description, title, oldGameFiles },
      { abortEarly: true }
    );
    if (validationResult.error) {
      response.status(200).json({
        status: "FAILED",
        message: validationResult?.error?.details[0]?.message,
      });
      return;
    }

    //check user exist or not
    const isGameExist = await gameServices.getGameById(gameId);

    if (!isGameExist) {
      return response.status(200).json({
        status: "FAILED",
        message: "Game does not exist",
      });
    }

    // if (!isGameExist ?) {
    //     return response.status(200).json({
    //         status: "FAILED",
    //         message: "User does not exist"
    //     });
    // };
    // //check contest exist or not
    // for (let id of contestIds) {
    // const isContestExist = await userServices.getUserByObjId(id);
    // if (!isContestExist) {
    //     return response.status(200).json({
    //         status: "FAILED",
    //         message: "User does not exist"
    //     });
    // };
    // }

    const attachment =
      request.files?.map((file) => {
        const splitUrlArray = file?.destination?.split("/");
        const filteredUrl =
          splitUrlArray[splitUrlArray.length - 3] +
          "/" +
          splitUrlArray[splitUrlArray.length - 2] +
          "/" +
          splitUrlArray[splitUrlArray.length - 1] +
          file.filename;
        return {
          documentName: file.originalname,
          fileUrl: filteredUrl,
        };
      }) ?? [];

    const dataToInsert = {
      name: name ? name : isGameExist.name,
      description: description ? description : isGameExist.description,
      title: title ? title : isGameExist.title,
      updatedBy: id,
      gamefiles: [...attachment, ...oldGameFiles] ?? [],
    };

    //Add role in db and send response to client
    const result = await gameServices.updateGame(gameId, dataToInsert);

    if (result) {
      request.io.emit("gameUpdated", {
        gameId,
        name: dataToInsert.name,
        description: dataToInsert.description,
        title: dataToInsert.title,
        updatedBy: dataToInsert.id,
        gamefiles: dataToInsert.gamefiles,
      });

      return response.status(200).json({
        status: "SUCCESS",
        message: "Game updated successfully",
      });
    } else {
      return response.status(200).json({
        status: "FAILED",
        message: "Failed to update game, please try again!",
      });
    }
  } catch (error) {
    response.status(500).json({
      status: "FAILED",
      message: error.message,
    });
    return;
  }
};

module.exports = updateGame;
