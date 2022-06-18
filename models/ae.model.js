module.exports = (sequelize, DataTypes) => {
    const Ae = sequelize.define("ae", {
        descricao:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: { msg: "Description cannot be empty or null!" } }
        },
        utilizadorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { notNull: { msg: "User ID cannot be null!" } }
        },
        data:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: { msg: "Data can not be empty or null!" } }
        }
    }, {
        timestamps: false
    });
    return Ae;
};