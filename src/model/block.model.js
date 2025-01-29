
const Block = (sequelize, DataTypes) => {
    return sequelize.define('Block', {
        id: {
            type: DataTypes.UUID, // Ensure this matches the type used in User model
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        blockNo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        locationId: {
            type: DataTypes.UUID,
            references: {
                model: 'Location', // 'Locations' should match the name of the Location model
                key: 'id',
            },
        }
    }, {
        paranoid: true, // Enables soft delete
        tableName: 'Block',
        timestamps: true,
    })
};


module.exports = Block;