
const Brand = (sequelize, DataTypes) => {
    return sequelize.define('Brand', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        categoryId: {
            type: DataTypes.UUID,
            references: {
                model: 'Category', // 'Category' should match the name of the Location model
                key: 'id',
            },
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        }
    }, {
        paranoid: true, // Enables soft delete
        tableName: 'Brand',
        timestamps: true,
    })
};


module.exports = Brand;