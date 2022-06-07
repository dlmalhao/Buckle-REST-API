module.exports = (sequelize, DataTypes) => {
    const Project_comment = sequelize.define("project_comment", {
        id_quem_comentou: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: { notNull: { msg: "ID can not be empty or null!" } }
        },
    }, {
        timestamps: false
    });
    return Project_comment;
};