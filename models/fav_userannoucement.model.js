module.exports = (sequelize, DataTypes) => {
    const Fav_userannoucement = sequelize.define("fav_userannoucement", {
    }, {
        timestamps: false
    });
    return Fav_userannoucement;
};