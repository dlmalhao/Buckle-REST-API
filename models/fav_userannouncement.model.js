module.exports = (sequelize, DataTypes) => {
    const Fav_userannouncement = sequelize.define("fav_userannouncement", {
    }, {
        timestamps: false
    });
    return Fav_userannouncement;
};