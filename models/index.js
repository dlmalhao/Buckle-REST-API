const dbConfig = require('../config/db.config.js');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect
    ,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

// sequelize.authenticate()
//     .then(() => {
//         console.log('Connection has been established successfully.');
//     })
//     .catch(err => {
//         console.error('Unable to connect to the database:', err);
//     });

(async () => {
    try {
        await sequelize.authenticate;
        console.log('Connection has been established successfully.');
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
})();

const db = {};
db.sequelize = sequelize;

//export User model
db.user = require("./user.model.js")(sequelize, DataTypes);

//export Project model
db.project = require("./project.model.js")(sequelize, DataTypes);
//export announcement model
db.announcement = require("./announcement.model")(sequelize, DataTypes);
//export announcement model
db.ae = require("./ae.model")(sequelize, DataTypes);
//export Comment model
db.comment = require("./comment.model.js")(sequelize, DataTypes);
//export Comment model
db.commentProject = require("./commentProject.model")(sequelize, DataTypes);
//export Curso model
db.course = require("./course.model.js")(sequelize, DataTypes);
//export User_comment model
db.user_comment = require("./user_comment.model.js")(sequelize, DataTypes);
// export project_comment
db.project_comment = require("./project_comment.model.js")(sequelize, DataTypes);
//export fav_userproject
db.favProject = require("./favProject.model.js")(sequelize, DataTypes);
//export fav_userproject
db.favAnnouncement = require("./favAnnouncement.model.js")(sequelize, DataTypes);
//define relationships
db.projectImage = require("./projectImage.model.js")(sequelize, DataTypes);
//export chat
db.chat = require("./chat.model")(sequelize, DataTypes);
//export messages
db.message = require("./messages.model")(sequelize, DataTypes);


//users

//1:M
db.course.hasMany(db.user);
db.user.belongsTo(db.course);
//1:M
db.user.hasMany(db.announcement);
db.announcement.belongsTo(db.user);
//1:M
db.user.hasMany(db.ae);
db.ae.belongsTo(db.user);
//N:M
db.user.belongsToMany(db.project, { through: 'UserProjects' });
db.project.belongsToMany(db.user, { through: 'UserProjects' });
//1:M
db.user.hasMany(db.user_comment);
db.user_comment.belongsTo(db.user);
//1:M
db.user.hasMany(db.favProject);
db.favProject.belongsTo(db.user);
//1:M
db.user.hasMany(db.favAnnouncement);
db.favAnnouncement.belongsTo(db.user);

//projects
//1:M
db.project.hasMany(db.project_comment, {foreignKey: 'id_projeto'});
db.project_comment.belongsTo(db.project, {foreignKey: 'id_projeto'});

//comments Projetos
//1:M
db.commentProject.hasMany(db.project, {foreignKey: 'utilizadorId'});
db.project.belongsTo(db.commentProject, {foreignKey: 'utilizadorId'});

//1:M
db.project.hasMany(db.projectImage);
db.projectImage.belongsTo(db.project);

//comments
//1:M
db.comment.hasMany(db.user_comment, {foreignKey: 'id_comentario'});
db.user_comment.belongsTo(db.comment, {foreignKey: 'id_comentario'});
//1:M
db.comment.hasMany(db.project_comment, {foreignKey: 'id_comentario'});
db.project_comment.belongsTo(db.comment, {foreignKey: 'id_comentario'});

//1:M
db.chat.hasMany(db.message, {foreingKey: 'id_chat'});
db.message.belongsTo(db.chat, {foreingKey: 'id_chat'});



// optionally: SYNC
// db.sequelize.sync()
//     .then(() => {
//         console.log('DB is successfully synchronized')
//     })
//     .catch(e => {
//         console.log(e)
//     });

// optionally: SYNC
(async () => {
    try {
        await sequelize.sync(/*{ force: true }*/);
        console.log('DB is successfully synchronized')
    } catch (error) {
        console.log(e)
    }
})();

module.exports = db;
