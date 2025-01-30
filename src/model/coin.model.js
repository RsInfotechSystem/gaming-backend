
const Coin = (sequelize, DataTypes) => {
    return sequelize.define("Coin", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        valuePerCoin: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        paranoid: true,
        tableName: "Coin",
        timestamps: true,
    });
}


module.exports = Coin;