const playerServices = require("../../db.services.js/player.service");

const getPlayerList = async (request, response) =>{
    try{
        const { page, searchString } = request.body;

        const list = await playerServices.getPlayerList(page, searchString);

        if(list?.totalPages){
            return response.status(200).json({
                status : "SUCCESS",
                message : "Player list fetched successfully",
                ...list,
            });
        }else{
            return response.status(200).json({
                status : "FAILED",
                message : "Player list not available",
            });
        }

    }catch(error){
        console.log("Error while getting player list : ",error);
        return response.status(500).json({
            status : "FAILED",
            message : error.message,
        });
    }
}

module.exports = getPlayerList;