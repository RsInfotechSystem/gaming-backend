
const Order = (sequelize, DataTypes) => {
    return sequelize.define('Order', {
        id: {
            type: DataTypes.UUID, // Ensure this matches the type used in User model
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        salesOrderNo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        orderDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: null
        },
        completeBy: {
            type: DataTypes.DATE,
            allowNull: false
        },
        orderTakenBy: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id'
            }
        },
        orderLocation: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Location',
                key: 'id'
            }
        },
        assignTo: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'User',
                key: 'id'
            }
        },
        formStatus: {
            type: DataTypes.STRING,
            allowNull: false
        },
        customerName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        customerNo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        customerAddress: {
            type: DataTypes.STRING,
            allowNull: true
        },
        contactPerson: {
            type: DataTypes.STRING,
            allowNull: true
        },
        remark: {
            type: DataTypes.STRING,
            allowNull: true
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        paranoid: true, // Enables soft delete
        tableName: 'Order',
        timestamps: true,
    })
};


module.exports = Order;