
const Game = (Sequelize, DataTypes) => {
    return Sequelize.define('Game', {
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
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId : {
            type: DataTypes.UUID,
            references: {
                model: 'User',
                key: 'id',
            },
        },
        title : {
            type: DataTypes.STRING,
            allowNull: false,
        },
        playerCount : {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        // coin : {
        //     type: DataTypes.UUID,
        //     references: {
        //         model: 'Coin',
        //         key: 'id',
        //     },
        // },
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
        paranoid: true,
        tableName : "Game",
        timestamps: true,
    });
}

module.exports = Game;