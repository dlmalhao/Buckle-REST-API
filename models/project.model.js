module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define("project", {
        titulo: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: { msg: "Title can not be empty or null!" } }
        },
        descricao:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: { msg: "Description can not be empty or null!" } }
        },
        data:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: { msg: "Data can not be empty or null!" } }
        },
        utilizadorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { notNull: { msg: "User ID cannot be null!" } }
        },
    }, {
        timestamps: false
    });
    return Project;
};