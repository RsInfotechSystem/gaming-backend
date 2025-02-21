const YoutubeVideo = (sequelize, DataTypes) => {
    return Sequelize.define("YoutubeVideo", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        videoUrl: {
            type: DataTypes.STRING,
            allowNull: false
        },
        thumbnail: {
            type: DataTypes.JSONB,
            allowNull: false
        },
    },
{
    paranoid: true,
    tableName: "Contest",
    timestamps: true,
})
};
module.exports = YoutubeVideo;