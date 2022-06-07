const db = require("../models/index.js");
const Project = db.project;

//necessary for LIKE operator
const { Op, ValidationError } = require('sequelize');
const { project } = require("../models/index.js");

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
    const projects = data.rows;
    const currentPage = page;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, projects, totalPages, currentPage };
};

// Display list of all users (with pagination)
exports.findAll = async (req, res) => {
    //get data from request query string (if not existing, they will be undefined)
    let { page, size, titulo } = req.query;
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
    const limit = size ? size : 3;          // limit = size (default is 3)
    const offset = page ? page * limit : 0; // offset = page * size (start counting from page 0)
    // console.log(`Limit ${limit} Offset ${offset}`)

    // search by title require to build a query with the operator L
    const condition = titulo ? { titulo: { [Op.like]: `%${titulo}%` } } : null;

    try {
        let projects = await Project.findAndCountAll({ where: condition, limit, offset })
        
        // map default response to desired response data structure
        res.status(200).json({
            success: true,
            totalItems: projects.count,
            projects: projects.rows,
            totalPages: Math.ceil(projects.count / limit),
            currentPage: page ? page : 0
        });
    }
    catch (err) {
        res.status(500).json({
            success: false, msg: err.message || "Some error occurred while retrieving the projects."
        })
        
    }
};

// List just one user
exports.findOne = async (req, res) => {
    try {
        let project = await Project.findByPk(req.params.projectID)

         if (project === null)
            res.status(404).json({
                success: false, msg: `Cannot find any project with ID ${req.params.projectID}.`
            });
        else
            res.json({ success: true, project: project });
    }
    catch (err) {
        res.status(500).json({
            success: false, msg: `Error retrieving project with ID ${req.params.projectID}.`
        });
    };
};

// Handle user create on POST
exports.create = async (req, res) => {
    // no need validation

    try {
        let newProject = await Project.create(req.body);
        res.status(201).json({ success: true, msg:"New project created", URL: `/projects/${newProject.id}` })
    }
    catch (err) {
        // console.log(err.name) // err.name === 'SequelizeValidationError'
        if (err instanceof ValidationError)
            res.status(400).json({ success: false, msg: err.errors.map(e => e.message) });
        else
            res.status(500).json({
                success: false, msg: err.message || "Some error occurred while creating the project."
            });
    };
};

exports.update = async (req, res) => {
    try {
        // since Sequelize update() does not distinguish if a tutorial exists, first let's try to find one
        let project = await Project.findByPk(req.params.projectID);
        if (project === null)
            return res.status(404).json({
                success: false, msg: `Cannot find any project with ID ${req.params.projectID}.`
            });
            
        // obtains only a single entry from the table, using the provided primary key
        let affectedRows = await Project.update(req.body, { where: { id: req.params.projectID } })

        if (affectedRows[0] === 0) // check if the tutorial was updated (returns [0] if no data was updated)
            return res.status(200).json({
                success: true, msg: `No updates were made on project with ID ${req.params.projectID}.`
            });

        res.json({
            success: true,
            msg: `Project with ID ${req.params.projectID} was updated successfully.`
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
        let result = await Project.destroy({ where: { id: req.params.projectID } })
        // console.log(result)
        if (result == 1) // the promise returns the number of deleted rows
            return res.status(200).json({
                success: true, msg: `Project with id ${req.params.projectID} was successfully deleted!`
            });
        // no rows deleted -> no tutorial was found
        res.status(404).json({
            success: false, msg: `Cannot find any project with ID ${req.params.projectID}.`
        });
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            success: false, msg: `Error deleting project with ID ${req.params.projectID}.`
        });
    };
};

