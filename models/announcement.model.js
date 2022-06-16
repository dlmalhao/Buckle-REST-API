module.exports = (sequelize, DataTypes) => {
    const Announcement = sequelize.define("announcement", {
        titulo: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: { msg: "Title can not be empty or null!" } }
        },
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
        img:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        tipo: {
            type: DataTypes.ENUM("Oferta", "Procura"),
            defaultValue: "Oferta",
            allowNull: false,
            validate: {
                isIn: {
                    args: [["Oferta", "Procura"]],
                    msg: "Announcement type cannot be null!"
                }
            }
        },
        data:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: { msg: "Data can not be empty or null!" } }
        }
    }, {
        timestamps: false
    });
    return Announcement;
};