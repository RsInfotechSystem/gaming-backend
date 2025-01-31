
const Coin = (sequelize, DataTypes) => {
    return sequelize.define("Coin", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        coinsCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        rupeesAmt: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
    }, {
        paranoid: true,
        tableName: "Coin",
        timestamps: true,
    });
}


module.exports = Coin;