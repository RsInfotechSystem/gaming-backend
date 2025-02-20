const Wallet = (sequelize, DataTypes) => {
    return sequelize.define("Wallet", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        playerId: {
            type: DataTypes.UUID,
            references: {
            model: "Player",
            key: "id",
            },
            allowNull: false,
        },
        earnedAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00
        },
        paymentLogs : {
            type: DataTypes.JSON,  // Store logs in a JSON column
            allowNull: true,    
            defaultValue: []
        }
    },{
        paranoid: true,
        tableName: "Wallet",
        timestamps: true,
    });
}

module.exports = Wallet;