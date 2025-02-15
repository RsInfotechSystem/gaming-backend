const Contest = (Sequelize, DataTypes) => {
    return Sequelize.define('Contest', {
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
        gameId: {
            type: DataTypes.UUID,
            references: {
                model: 'Game',
                key: 'id',
            },
            allowNull: false, // Ensure gameId cannot be an empty array
        },
        gameType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contestDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        contestTime: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        reqCoinsToJoin: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        winningPrice: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        playersLimit: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        roomId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        passwordToJoin: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        contestFiles: {
            type: DataTypes.JSONB,  // Store as an array of UUIDs
            allowNull: false,
            defaultValue: [],  // Start with an empty array
        },
        winningFiles: {
            type: DataTypes.JSONB,  // Store as an array of UUIDs
            allowNull: false,
            defaultValue: [],  // Start with an empty array
        },
        winner: {
            type: DataTypes.UUID,
            references: {
                model: 'Player',
                key: 'id',
            },
            allowNull: true
        },
        noOfWinners: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        createdBy: {
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
        tableName: "Contest",
        timestamps: true,
    });
};

module.exports = Contest;
