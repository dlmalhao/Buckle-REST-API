module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define("comment", {
        desc_comentario: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: { msg: "Comment can not be empty or null! "} }
        }
    }, {
        timestamps: false
    });
    return Comment;
};