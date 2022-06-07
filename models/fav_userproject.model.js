module.exports = (sequelize, DataTypes) => {
    const Fav_userproject = sequelize.define("fav_userproject", {
    }, {
        timestamps: false
    });
    return Fav_userproject;
};