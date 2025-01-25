
const Notification = (sequelize, DataTypes) => {
    return sequelize.define('Notification', {
        id: {
            type: DataTypes.UUID, // Ensure this matches the type used in User model
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdBy: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        notificationFor: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isSeen: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        }
    }, {
        paranoid: true, // Enables soft delete
        tableName: 'Notification',
        timestamps: true,
    })
};


module.exports = Notification;