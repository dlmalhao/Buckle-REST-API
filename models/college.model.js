module.exports = (sequelize, DataTypes) => {
    const College = sequelize.define("college", {
        desc_faculdade: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: { msg: "College can not be empty or null!" } }
        },
    }, {
        timestamps: false
    });
    return College;
};