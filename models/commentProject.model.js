module.exports = (sequelize, DataTypes) => {
    const CommentProject = sequelize.define("commentProject", {
        desc_comentario: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: { msg: "Comment can not be empty or null! "} }
        },
        id_quem_comentou: { type : DataTypes.INTEGER},
        id_projeto: { type : DataTypes.INTEGER}
    }, {
        timestamps: false
    });
    return CommentProject;
};