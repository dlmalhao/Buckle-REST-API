module.exports = (sequelize, DataTypes) => {
    const Annoucement = sequelize.define("annoucement", {
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
            type: DataTypes.DATE,
            allowNull: false,
            validate: { notNull: { msg: "Data can not be empty or null!" } }
        },
        img:{
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {
        timestamps: false
    });
    return Annoucement;
};