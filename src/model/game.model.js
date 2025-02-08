
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
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        addedBy: {
            type: DataTypes.UUID,
            references: {
                model: 'User',
                key: 'id',
            },
        },
        updatedBy: {
            type: DataTypes.UUID,
            references: {
                model: 'User',
                key: 'id',
            },
        },
        // contestId: {
        //     type: DataTypes.UUID,
        //     references: {
        //         model: 'Contest',
        //         key: 'id',
        //     },
        //     defaultValue: [],
        // },
        // oldGameFiles: {
        //     type: DataTypes.JSON,
        //     allowNull: true,
        //     defaultValue: [],
        // },
        gamefiles: {
            type: DataTypes.JSONB,  // JSONB allows storing structured JSON (array of objects)
            allowNull: false,
            defaultValue: [], // Default to an empty array
        },

        playedCount: {
            type: DataTypes.INTEGER,
            allowNull: true,
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
        paranoid: true,
        tableName: "Game",
        timestamps: true,
    });
}

module.exports = Game;