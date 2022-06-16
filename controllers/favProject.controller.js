const db = require("../models/index.js");
const FavProject = db.favProject;

//necessary for LIKE operator
const { Op, ValidationError } = require('sequelize');
const { favProject } = require("../models/index.js");

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
    const favProjects = data.rows;
    const currentPage = page;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, favProjects, totalPages, currentPage };
};

// Display list of all users (with pagination)
exports.findAll = async (req, res) => {
    //get data from request query string (if not existing, they will be undefined)
    let { page, size, desc } = req.query;
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
    //      offset -> number of rows to be offseted (not retrieved)// limit = size (default is 3)
    const offset = page ? page * limit : 0; // offset = page * size (start counting from page 0)
    // console.log(`Limit ${limit} Offset ${offset}`)

    // search by title require to build a query with the operator L
    const condition = desc ? { desc: { [Op.like]: `%${desc}%` } } : null;

    try {
        let favProjects = await FavProject.findAndCountAll({ where: condition, offset })
        
        // map default response to desired response data structure
        res.status(200).json({
            success: true,
            totalItems: favProjects.count,
            favProjects: favProjects.rows,
            currentPage: page ? page : 0
        });
    }
    catch (err) {
        res.status(500).json({
            success: false, msg: err.message || "Some error occurred while retrieving the FavProject."
        })
        
    }
};

exports.findOne = async (req, res) => {
    try {
        let favProject = await FavProject.findByPk(req.params.favProjectID)

         if (favProject === null)
            res.status(404).json({
                success: false, msg: `Cannot find any favProject with ID ${req.params.favProjectID}.`
            });
        else
            res.json({ success: true, favProject: favProject });
    }
    catch (err) {
        res.status(500).json({
            success: false, msg: `Error retrieving favProject with ID ${req.params.favProjectID}.`
        });
    };
};

// Handle user create on POST
exports.create = async (req, res) => {
    // no need validation

    try {
        let newFavProject = await FavProject.create({
            id_utilizador_recebido: req.body.id_utilizador_recebido,
            id_utilizador_dado: req.body.id_utilizador_dado,
        })
        res.status(201).json({ success: true, msg:"New favProject created", URL: `/favProjects/${newFavProject.id}` })
    }
    catch (err) {
        // console.log(err.name) // err.name === 'Seque  lizeValidationError'
        if (err instanceof ValidationError)
            res.status(400).json({ success: false, msg: err.errors.map(e => e.message) });
        else
            res.status(500).json({
                success: false, msg: err.message || "Some error occurred while creating the favProject."
            });
    };
};

exports.update = async (req, res) => {
    try {
        // since Sequelize update() does not distinguish if a tutorial exists, first let's try to find one
        let favProject = await FavProject.findByPk(req.params.favProjectID);
        if (favProject === null)
            return res.status(404).json({
                success: false, msg: `Cannot find any favProject with ID ${req.params.favProjectID}.`
            });
            
        // obtains only a single entry from the table, using the provided primary key
        let affectedRows = await FavProject.update(req.body, { where: { id: req.params.favProjectID } })

        if (affectedRows[0] === 0) // check if the tutorial was updated (returns [0] if no data was updated)
            return res.status(200).json({
                success: true, msg: `No updates were made on favProject with ID ${req.params.favProjectID}.`
            });

        res.json({
            success: true,
            msg: `FavProject with ID ${req.params.favProjectID} was updated successfully.`
        });
    }
    catch (err) {
        if (err instanceof ValidationError)
            return res.status(400).json({ success: false, msg: err.errors.map(e => e.message) });
        res.status(500).json({
            success: false, msg: `Error retrieving favProject with ID ${req.params.favProjectID}.`
        });
    };
};

exports.delete = async (req, res) => {
    try {
        let result = await FavProject.destroy({ where: { id: req.params.favProjectID } })
        // console.log(result)
        if (result == 1) // the promise returns the number of deleted rows
            return res.status(200).json({
                success: true, msg: `FavProject with id ${req.params.favProjectID} was successfully deleted!`
            });
        // no rows deleted -> no tutorial was found
        res.status(404).json({
            success: false, msg: `Cannot find any favProject with ID ${req.params.favProjectID}.`
        });
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            success: false, msg: `Error deleting favProject with ID ${req.params.favProjectID}.`
        });
    };
};