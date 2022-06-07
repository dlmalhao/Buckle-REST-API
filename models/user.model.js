module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        email_utilizador: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: { msg: "Email can not be empty or null!" } }
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: { msg: "Name can not be empty or null!" } }
        },
        sobrenome: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: { msg: "Surname can not be empty or null!" } }
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: { msg: "Password can not be empty or null!" } }
        },
        role: {
            type: DataTypes.STRING,
        },
        img : {
            type: DataTypes.STRING,
        }
    }, {
        timestamps: false
    });
    return User;
};