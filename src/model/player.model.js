const Player = (sequelize, DataTypes) => {
  return sequelize.define("Player", {
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
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    availableCoins: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    joinedContests: {
      type: DataTypes.JSONB,  // Store as an array of player UUIDs
      allowNull: false,
      defaultValue: [],  // Ensure an empty array as default
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
    {
      timestamps: true,
      paranoid: true,
      tableName: "Player",
    }
  );
};

module.exports = Player;