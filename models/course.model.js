module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define("course", {
        descricao_curso: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: { msg: "Description can not be empty or null!" } }
        },
        value: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {
        timestamps: false
    });
    return Course;
};