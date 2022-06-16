const db = require("../models/index.js");
const Course = db.course;

//necessary for LIKE operator
const { Op, ValidationError } = require('sequelize');
const { course } = require("../models/index.js");

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
    const courses = data.rows;
    const currentPage = page;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, courses, totalPages, currentPage };
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
    const limit = size ? size : 10;          // limit = size (default is 3)
    const offset = page ? page * limit : 0; // offset = page * size (start counting from page 0)
    // console.log(`Limit ${limit} Offset ${offset}`)

    // search by title require to build a query with the operator L
    const condition = titulo ? { titulo: { [Op.like]: `%${titulo}%` } } : null;

    try {
        let courses = await Course.findAndCountAll({ where: condition, limit, offset })
        
        // map default response to desired response data structure
        res.status(200).json({
            success: true,
            totalItems: courses.count,
            courses: courses.rows,
            totalPages: Math.ceil(courses.count / limit),
            currentPage: page ? page : 0
        });
    }
    catch (err) {
        res.status(500).json({
            success: false, msg: err.message || "Some error occurred while retrieving the course."
        })
        
    }
};

exports.findOne = async (req, res) => {
    try {
        let course = await Course.findByPk(req.params.courseID)

         if (course === null)
            res.status(404).json({
                success: false, msg: `Cannot find any course with ID ${req.params.courseID}.`
            });
        else
            res.json({ success: true, course: course });
    }
    catch (err) {
        res.status(500).json({
            success: false, msg: `Error retrieving course with ID ${req.params.courseID}.`
        });
    };
};

// Handle user create on POST
exports.create = async (req, res) => {
    // no need validation

    try {

        let course = await Course.create({
            descricao_curso: req.body.descricao_curso,
            value: req.body.value,
        })

        console.log(course)


        res.status(201).json({ success: true, msg:"New course created", URL: `/courses/${course.id}` })
    }
    catch (err) {
        // console.log(err.name) // err.name === 'SequelizeValidationError'
        if (err instanceof ValidationError)
            res.status(400).json({ success: false, msg: err.errors.map(e => e.message) });
        else
            res.status(500).json({
                success: false, msg: err.message || "Some error occurred while creating the course."
            });
    };
};

exports.update = async (req, res) => {
    try {
        // since Sequelize update() does not distinguish if a tutorial exists, first let's try to find one
        let course = await Course.findByPk(req.params.courseID);
        if (course === null)
            return res.status(404).json({
                success: false, msg: `Cannot find any course with ID ${req.params.courseID}.`
            });
            
        // obtains only a single entry from the table, using the provided primary key
        let affectedRows = await Course.update(req.body, { where: { id: req.params.courseID } })

        if (affectedRows[0] === 0) // check if the tutorial was updated (returns [0] if no data was updated)
            return res.status(200).json({
                success: true, msg: `No updates were made on course with ID ${req.params.courseID}.`
            });

        res.json({
            success: true,
            msg: `course with ID ${req.params.courseID} was updated successfully.`
        });
    }
    catch (err) {
        if (err instanceof ValidationError)
            return res.status(400).json({ success: false, msg: err.errors.map(e => e.message) });
        res.status(500).json({
            success: false, msg: `Error retrieving course with ID ${req.params.courseID}.`
        });
    };
};

exports.delete = async (req, res) => {
    try {
        let result = await Course.destroy({ where: { id: req.params.courseID } })
        // console.log(result)
        if (result == 1) // the promise returns the number of deleted rows
            return res.status(200).json({
                success: true, msg: `course with id ${req.params.courseID} was successfully deleted!`
            });
        // no rows deleted -> no tutorial was found
        res.status(404).json({
            success: false, msg: `Cannot find any course with ID ${req.params.courseID}.`
        });
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            success: false, msg: `Error deleting course with ID ${req.params.courseID}.`
        });
    };
};

