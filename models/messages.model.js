module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define("message", {
        id_chat: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { notNull: { msg: "Chat cannot be null" } }
        },
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { notNull: { msg: "User cannot be null" } }
        },
        text: {
            type: DataTypes.STRING,
        },
        date:{
            type:DataTypes.DATE,
        },
    }, {
        timestamps: false
    });
    return Message;
};