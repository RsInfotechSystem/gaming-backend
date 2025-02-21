const ContestPlayer = (sequelize, DataTypes) => {
  return sequelize.define(
    "ContestPlayer",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      contestId: {
        type: DataTypes.UUID,
        references: {
          model: "Contest",
          key: "id",
        },
        allowNull: false,
      },
      playerId: {
        type: DataTypes.UUID,
        references: {
          model: "Player",
          key: "id",
        },
        allowNull: false,
      },
      gameUserName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gameUserId : {
        type : DataTypes.STRING,
        allowNull : true,
      },
      joinDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      indexes: [
        {
          fields: ["contestId"],
        },
        {
          fields: ["playerId"],
        },
      ],
      paranoid: true,
      tableName: "ContestPlayer",
      timestamps: true,
    }
  );
};

module.exports = ContestPlayer;