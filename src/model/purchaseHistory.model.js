const PurchaseHistory = (Sequelize, DataTypes) => {
    return Sequelize.define('PurchaseHistory', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        playerId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Player',   // Must match your Player model's table name
                key: 'id'
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        coinsCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        transactionId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        paranoid: true,
        tableName: "PurchaseHistory",
        timestamps: true,
    });
}

module.exports = PurchaseHistory;