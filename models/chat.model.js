module.exports = (sequelize, DataTypes) => {
    const Chat = sequelize.define("chat", {
        id_user1: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { notNull: { msg: "User cannot be null" } }
        },
        id_user2: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { notNull: { msg: "User cannot be null" } }
        },
    }, {
        timestamps: false
    });
    return Chat;
};