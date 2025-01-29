
const StockOut = (sequelize, DataTypes) => {
    return sequelize.define('StockOut', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        stockId: {
            type: DataTypes.UUID,
            references: {
                model: 'Stock',
                key: 'id',
            },
        },
        stockOutById: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id'
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'new'
        },
        isApprove: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        }
    }, {
        paranoid: true, // Enables soft delete
        tableName: 'StockOut',
        timestamps: true,
    })
};

module.exports = StockOut;