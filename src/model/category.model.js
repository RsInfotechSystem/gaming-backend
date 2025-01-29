const Category = (sequelize, DataTypes) => {
    return sequelize.define('Category', {
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
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        }
    }, {
        paranoid: true, // Enables soft delete
        tableName: 'Category',
        timestamps: true,
    })
};


module.exports = Category;