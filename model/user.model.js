const User = (sequelize, DataTypes) => {
    return sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        roleName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        mobile: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /^[0-9]{10}$/g,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        roleId: {
            type: DataTypes.UUID,
            references: {
                model: 'Role', // 'Roles' should match the name of the Role model
                key: 'id',
            },
        },
        // locationId: {
        //     type: DataTypes.UUID,
        //     references: {
        //         model: 'Location', // 'Locations' should match the name of the Location model
        //         key: 'id',
        //     },
        // },
        userId: {
            type: DataTypes.STRING,
            unique: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        }
    }, {
        paranoid: true, // Enables soft delete
        tableName: 'User',
        timestamps: true,
    });
};

module.exports = User;
