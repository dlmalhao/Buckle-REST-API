module.exports = (sequelize, DataTypes) => {
    const FavProject = sequelize.define("favProject", {
        id_utilizador_recebido: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { notNull: { msg: "id_utilizador_recebido can not be empty or null!" } }
        },
        id_utilizador_dado: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { notNull: { msg: "id_utilizador_dado can not be empty or null!" } }
        },
    }, {
        timestamps: false
    });
    return FavProject;
};