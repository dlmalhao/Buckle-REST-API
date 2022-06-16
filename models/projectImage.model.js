module.exports = (sequelize, DataTypes) => {
    const ProjectImage = sequelize.define("projectImage", {
        projetoID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { notNull: { msg: "ProjetoID can not be empty or null!" } }
        },
        descricao:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: { msg: "Description can not be empty or null!" } }
        },
    }, {
        timestamps: false
    });
    return ProjectImage;
};