const db = require("../models/index.js");
const User = db.user;
const course = db.course
const bcrypt = require("bcryptjs");

//necessary for LIKE operator
const { Op, ValidationError } = require('sequelize');
const { user } = require("../models/index.js");

// function to map default response to desired response data structure
// {
//     "totalItems": 8,
//     "tutorials": [...],
//     "totalPages": 3,
//     "currentPage": 1
// }
const getPagingData = (data, page, limit) => {
    // data Sequelize Model method findAndCountAll function has the form
    // {
    //     count: 5,
    //     rows: [
    //              tutorial {...}
    //         ]
    // }
    const totalItems = data.count;
    const users = data.rows;
    const currentPage = page;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, users, totalPages, currentPage };
};

// Display list of all users (with pagination)
// Display list of all users (with pagination)
exports.findAll = async (req, res) => {
    //get data from request query string (if not existing, they will be undefined)
    let { page, size, nome } = req.query;
    // console.log(`Page ${page} Size ${size} Nome ${nome}`)

    // validate page
    if (page && !req.query.page.match(/^(0|[1-9]\d*)$/g)) {
        res.status(400).json({ message: 'Page number must be 0 or a positive integer' });
        return;
    }
    else
        page = parseInt(page); // if OK, convert it into an integer
    // validate size
    if (size && !req.query.size.match(/^([1-9]\d*)$/g)) {
        res.status(400).json({ message: 'Size must be a positive integer' });
        return;
    } else
        size = parseInt(size); // if OK, convert it into an integer

    // Sequelize function findAndCountAll parameters: 
    //      limit -> number of rows to be retrieved
    //      offset -> number of rows to be offseted (not retrieved)
              // limit = size (default is 3)
    const offset = page ? page * limit : 0; // offset = page * size (start counting from page 0)
    // console.log(`Limit ${limit} Offset ${offset}`)

    // search by title require to build a query with the operator L
    const condition = nome ? { nome: { [Op.like]: `%${nome}%` } } : null;

    try {
        let users = await User.findAndCountAll({ where: condition, offset,
            include: [
                {
                    model: course, attributes: ["id", "descricao_curso", "value"]
                }] });

        // map default response to desired response data structure
        res.status(200).json({
            success: true,
            totalItems: users.count,
            users: users.rows,
            currentPage: page ? page : 0
        });
    }
    catch (err) {
        res.status(500).json({
            success: false, msg: err.message || "Some error occurred while retrieving the users."
        })
    }
};

// Handle user create on POST
exports.create = async (req, res) => {
    let user

    if (req.body.email_utilizador) {
        user = await User.findOne(
            { where: { email_utilizador: req.body.email_utilizador } }
        );
    }

    if (user && req.params.userID != user.id)
        return res.status(400).json({ message: "Email already associated with an account!" });


    try {
        // Save Tutorial in the database
        let newUser = await User.create({
            email_utilizador: req.body.email_utilizador,
            nome: req.body.nome,
            sobrenome: req.body.sobrenome,
            password: bcrypt.hashSync(req.body.password, 10),
            role :"Admin",
            status :"active"
        });
        res.status(201).json({ success: true, msg: "New user created.", URL: `/users
        /${newUser.id}` });
    }
    catch (err) {
        // console.log(err.name) // err.name === 'SequelizeValidationError'
        if (err instanceof ValidationError)
            res.status(400).json({ success: false, msg: err.errors.map(e => e.message) });
        else
            res.status(500).json({
                success: false, msg: err.message || "Some error occurred while creating the user."
            });
    };
};

// List just one user
exports.findOne = async (req, res) => {
    try {
        // obtains only a single entry from the table, using the provided primary key
        let user = await User.findByPk(req.params.userID)

        if (user === null)
            res.status(404).json({
                success: false, message: `Cannot find any user with ID ${req.params.userID}.`
            });
        else
            res.json({ success: true, user: user });
    }
    catch (err) {
        res.status(500).json({
            success: false, message: `Error retrieving user with ID ${req.params.userID}.`
        });
    };
};

exports.update = async (req, res) => {
    let user

    if (req.body.email_utilizador) {
        user = await User.findOne(
            { where: { email_utilizador: req.body.email_utilizador } }
        );
    }

    if (user && req.params.userID != user.id)
        return res.status(400).json({ message: "Email already associated with an account!" });


    try {
        // since Sequelize update() does not distinguish if a tutorial exists, first let's try to find one
        let user = await User.findByPk(req.params.userID);
        if (user === null)
            return res.status(404).json({
                success: false, msg: `Cannot find any user with ID ${req.params.userID}.`
            });
            
        // obtains only a single entry from the table, using the provided primary key
        let affectedRows = await User.update(req.body, { where: { id: req.params.userID } })

        if (affectedRows[0] === 0) // check if the tutorial was updated (returns [0] if no data was updated)
            return res.status(200).json({
                success: true, msg: `No updates were made on user with ID ${req.params.userID}.`
            });

        res.json({
            success: true,
            msg: `User with ID ${req.params.userID} was updated successfully.`
        });
    }
    catch (err) {
        if (err instanceof ValidationError)
            return res.status(400).json({ success: false, msg: err.errors.map(e => e.message) });
        res.status(500).json({
            success: false, msg: `Error retrieving user with ID ${req.params.userID}.`
        });
    };
};

exports.delete = async (req, res) => {
    try {
       
        let result = await User.destroy({ where: { id: req.params.userID } })
        // console.log(result)
        if (result == 1) // the promise returns the number of deleted rows
            return res.status(200).json({
                success: true, msg: `User with id ${req.params.userID} was successfully deleted!`
            });
        // no rows deleted -> no tutorial was found
        res.status(404).json({
            success: false, msg: `Cannot find any user with ID ${req.params.userID}.`
        });
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            success: false, msg: `Error deleting user with ID ${req.params.userID}.`
        });
    };
};

