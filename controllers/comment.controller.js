const db = require("../models/index.js");
const Comment = db.comment;
const User = db.user;

//necessary for LIKE operator
const { Op, ValidationError } = require('sequelize');
// const { comment } = require("../models/index.js");

let user;

// function to map default response to desired response data structure
// {
//     "totalItems": 8,
//     "tutorials": [...],
//     "totalPages": 3,
//     "currentPage": 1
// }
// const getPagingData = (data, page, limit) => {
//     // data Sequelize Model method findAndCountAll function has the form
//     // {
//     //     count: 5,
//     //     rows: [
//     //              tutorial {...}
//     //         ]
//     // }
//     const totalItems = data.count;
//     const comments = data.rows;
//     const currentPage = page;
//     const totalPages = Math.ceil(totalItems / limit);

//     return { totalItems, comments, totalPages, currentPage };
// };

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
    // const limit = size ? size : 3;          // limit = size (default is 3)
    const offset = page ? page * limit : 0; // offset = page * size (start counting from page 0)
    // console.log(`Limit ${limit} Offset ${offset}`)

    // search by title require to build a query with the operator L
    const condition = desc ? { desc: { [Op.like]: `%${desc}%` } } : null;

    try {
        let comments = await Comment.findAndCountAll({ where: condition, offset })
        
        // map default response to desired response data structure
        res.status(200).json({
            success: true,
            totalItems: comments.count,
            comments: comments.rows,
            currentPage: page ? page : 0
        });
    }
    catch (err) {
        res.status(500).json({
            success: false, msg: err.message || "Some error occurred while retrieving the Comment."
        })
        
    }
};

exports.findOne = async (req, res) => {
    try {
        let comment = await Comment.findByPk(req.params.commentID)

         if (comment === null)
            res.status(404).json({
                success: false, msg: `Cannot find any comment with ID ${req.params.commentID}.`
            });
        else
            res.json({ success: true, comment: comment });
    }
    catch (err) {
        res.status(500).json({
            success: false, msg: `Error retrieving comment with ID ${req.params.commentID}.`
        });
    };
};

exports.create = async (req, res) => {
   let user = await User.findByPk(req.params.userID) 
   if(user == null) {
    return res.status(404).json({ success: false, msg:`Cannot find any user with ID ${req.params.userID}.`})
   }

    try {
        let newComment = await Comment.create({
            desc_comentario : req.body.desc_comentario,
            rating : req.body.rating,
            tipo_comentario: req.body.tipo_comentario,
            id_quem_comentou : req.body.id_quem_comentou,
            id_a_quem_comentou : req.body.id_a_quem_comentou

        })
        res.status(201).json({ success: true, msg:"New comment created", URL: `/comments/${newComment.id}` })
    }
    catch (err) {
        // console.log(err.name) // err.name === 'SequelizeValidationError'
        if (err instanceof ValidationError)
            res.status(400).json({ success: false, msg: err.errors.map(e => e.message) });
        else
            res.status(500).json({
                success: false, msg: err.message || "Some error occurred while creating the comment."
            });
    };
};

exports.update = async (req, res) => {
    try {
        // since Sequelize update() does not distinguish if a tutorial exists, first let's try to find one
        let comment = await Comment.findByPk(req.params.commentID);
        if (comment === null)
            return res.status(404).json({
                success: false, msg: `Cannot find any comment with ID ${req.params.commentID}.`
            });
            
        // obtains only a single entry from the table, using the provided primary key
        let affectedRows = await Comment.update(req.body, { where: { id: req.params.commentID } })

        if (affectedRows[0] === 0) // check if the tutorial was updated (returns [0] if no data was updated)
            return res.status(200).json({
                success: true, msg: `No updates were made on comment with ID ${req.params.commentID}.`
            });

        res.json({
            success: true,
            msg: `Comment with ID ${req.params.commentID} was updated successfully.`
        });
    }
    catch (err) {
        if (err instanceof ValidationError)
            return res.status(400).json({ success: false, msg: err.errors.map(e => e.message) });
        res.status(500).json({
            success: false, msg: `Error retrieving comment with ID ${req.params.commentID}.`
        });
    };
};

exports.delete = async (req, res) => {
    try {
        let result = await Comment.destroy({ where: { id: req.params.commentID } })
        // console.log(result)
        if (result == 1) // the promise returns the number of deleted rows
            return res.status(200).json({
                success: true, msg: `Comment with id ${req.params.commentID} was successfully deleted!`
            });
        // no rows deleted -> no tutorial was found
        res.status(404).json({
            success: false, msg: `Cannot find any comment with ID ${req.params.commentID}.`
        });
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            success: false, msg: `Error deleting comment with ID ${req.params.commentID}.`
        });
    };
};