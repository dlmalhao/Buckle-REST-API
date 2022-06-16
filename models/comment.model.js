module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define("comment", {
        desc_comentario: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: { msg: "Comment can not be empty or null! "} }
        },
        rating: { type : DataTypes.INTEGER, allowNull: false},
        tipo_comentario: {
            type: DataTypes.ENUM("perfil", "projeto"),
            defaultValue: "perfil",
            validate: {
                isIn: {
                    args: [["perfil", "projeto"]],
                    msg: "Tipo de comentário: perfil ou projeto",
                },
            },
        },
        id_quem_comentou: { type : DataTypes.INTEGER},
        id_a_quem_comentou: { type : DataTypes.INTEGER}
    }, {
        timestamps: false
    });
    return Comment;
};