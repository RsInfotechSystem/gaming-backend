const { sequelize } = require("../db/db");

const Coin = (sequelize, DataTypes) => {
    return sequelize.define("Coin",{
        id : {
            type : DataTypes.UUID,
            defaultValue : DataTypes.UUIDV4,
            primaryKey : true,
            allowNull : false
        },
        
    })
}