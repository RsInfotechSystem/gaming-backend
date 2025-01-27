const Role = (sequelize, DataTypes) => {
    return sequelize.define('Role', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        tab: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        }
    }, {
        paranoid: true, // Enables soft delete
        tableName: 'Role',
        timestamps: true,
    });
};

module.exports = Role;
