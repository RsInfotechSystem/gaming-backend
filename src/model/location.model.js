const Location = (sequelize, DataTypes) => {
    return sequelize.define('Location', {
        id: {
            type: DataTypes.UUID, // Ensure this matches the type used in User model
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        }
    }, {
        paranoid: true, // Enables soft delete
        tableName: 'Location',
        timestamps: true,
    })
};


module.exports = Location;