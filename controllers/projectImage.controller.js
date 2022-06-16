const db = require("../models/index.js");
const ProjectImage = db.projectImage;

//necessary for LIKE operator
const { Op, ValidationError } = require('sequelize');
const { projectImage } = require("../models/index.js");

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
    const projectImages = data.rows;
    const currentPage = page;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, projectImages, totalPages, currentPage };
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
    //      offset -> number of rows to be offseted (not retrieved)
              // limit = size (default is 3)
    const offset = page ? page * limit : 0; // offset = page * size (start counting from page 0)
    // console.log(`Limit ${limit} Offset ${offset}`)

    // search by title require to build a query with the operator L
    const condition = desc ? { desc: { [Op.like]: `%${desc}%` } } : null;

    try {
        let projectImages = await ProjectImage.findAndCountAll({ where: condition, offset })
        
        // map default response to desired response data structure
        res.status(200).json({
            success: true,
            totalItems: projectImages.count,
            projectImages: projectImages.rows,
            currentPage: page ? page : 0
        });
    }
    catch (err) {
        res.status(500).json({
            success: false, msg: err.message || "Some error occurred while retrieving the ProjectImage."
        })
        
    }
};

exports.findOne = async (req, res) => {
    try {
        let projectImage = await ProjectImage.findByPk(req.params.projectImageID)

         if (projectImage === null)
            res.status(404).json({
                success: false, msg: `Cannot find any projectImage with ID ${req.params.projectImageID}.`
            });
        else
            res.json({ success: true, projectImage: projectImage });
    }
    catch (err) {
        res.status(500).json({
            success: false, msg: `Error retrieving projectImage with ID ${req.params.projectImageID}.`
        });
    };
};

// Handle user create on POST
exports.create = async (req, res) => {
    // no need validation

    try {
        let newProjectImage = await ProjectImage.create(req.body);
        res.status(201).json({ success: true, msg:"New projectImage created", URL: `/projectImages/${newProjectImage.id}` })
    }
    catch (err) {
        // console.log(err.name) // err.name === 'SequelizeValidationError'
        if (err instanceof ValidationError)
            res.status(400).json({ success: false, msg: err.errors.map(e => e.message) });
        else
            res.status(500).json({
                success: false, msg: err.message || "Some error occurred while creating the projectImage."
            });
    };
};

exports.update = async (req, res) => {
    try {
        // since Sequelize update() does not distinguish if a tutorial exists, first let's try to find one
        let projectImage = await ProjectImage.findByPk(req.params.projectImageID);
        if (projectImage === null)
            return res.status(404).json({
                success: false, msg: `Cannot find any projectImage with ID ${req.params.projectImageID}.`
            });
            
        // obtains only a single entry from the table, using the provided primary key
        let affectedRows = await ProjectImage.update(req.body, { where: { id: req.params.projectImageID } })

        if (affectedRows[0] === 0) // check if the tutorial was updated (returns [0] if no data was updated)
            return res.status(200).json({
                success: true, msg: `No updates were made on projectImage with ID ${req.params.projectImageID}.`
            });

        res.json({
            success: true,
            msg: `ProjectImage with ID ${req.params.projectImageID} was updated successfully.`
        });
    }
    catch (err) {
        if (err instanceof ValidationError)
            return res.status(400).json({ success: false, msg: err.errors.map(e => e.message) });
        res.status(500).json({
            success: false, msg: `Error retrieving projectImage with ID ${req.params.projectImageID}.`
        });
    };
};

exports.delete = async (req, res) => {
    try {
        let result = await ProjectImage.destroy({ where: { id: req.params.projectImageID } })
        // console.log(result)
        if (result == 1) // the promise returns the number of deleted rows
            return res.status(200).json({
                success: true, msg: `ProjectImage with id ${req.params.projectImageID} was successfully deleted!`
            });
        // no rows deleted -> no tutorial was found
        res.status(404).json({
            success: false, msg: `Cannot find any projectImage with ID ${req.params.projectImageID}.`
        });
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            success: false, msg: `Error deleting projectImage with ID ${req.params.projectImageID}.`
        });
    };
};