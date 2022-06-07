module.exports = (sequelize, DataTypes) => {
    const User_comment = sequelize.define("user_comment", {
        id_quem_comentou: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: { notNull: { msg: "ID can not be empty or null!" } }
        },
        desc_comentario: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: { msg: "Comment can not be empty or null! "} }
        }
    }, {
        timestamps: false
    });
    return User_comment;
};