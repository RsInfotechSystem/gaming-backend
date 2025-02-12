const Transaction = (Sequelize, DataTypes) => {
    return Sequelize.define('Transaction', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            required: true,
        },
        mobile: {
            type: DataTypes.STRING,
            required: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        coinsCount:{
           type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        transactionId: {
            type: DataTypes.STRING,
            required: true
        },
        paymentType: {
            type: DataTypes.STRING,
            required: true
        },
        acquirer_data: {
            type: DataTypes.JSON,
            required: false,
            default: null
        }
    }, {
        paranoid: true,
        tableName: "Transaction",
        timestamps: true,
    });
}

module.exports = Transaction;