const db = require("../models/index.js");
const Chat = db.chat;
const User = db.user;

const { Op, ValidationError } = require('sequelize');

exports.findAll = async (req, res) => {
    let { page, size, desc } = req.query;

    if (page && !req.query.page.match(/^(0|[1-9]\d*)$/g)) {
        res.status(400).json({ message: 'Page number must be 0 or a positive integer' });
        return;
    }
    else
        page = parseInt(page); 

    if (size && !req.query.size.match(/^([1-9]\d*)$/g)) {
        res.status(400).json({ message: 'Size must be a positive integer' });
        return;
    } else
        size = parseInt(size); // if OK, convert it into an integer

    const offset = page ? page * limit : 0;
   
    const condition = desc ? { desc: { [Op.like]: `%${desc}%` } } : null;

    try {
        let chats = await Chat.findAndCountAll({ where: condition, offset })
    
        res.status(200).json({
            success: true,
            totalItems: chats.count,
            chats: chats.rows,
            currentPage: page ? page : 0
        });
    }
    catch (err) {
        res.status(500).json({
            success: false, msg: err.message || "Some error occurred while retrieving the Chat."
        })
        
    }
};

exports.findOne = async (req, res) => {
    try {
        let chat = await Chat.findByPk(req.params.chatID)

         if (chat === null)
            res.status(404).json({
                success: false, msg: `Cannot find any chat with ID ${req.params.chatID}.`
            });
        else
            res.json({ success: true, chat: chat });
    }
    catch (err) {
        res.status(500).json({
            success: false, msg: `Error retrieving chat with ID ${req.params.chatID}.`
        });
    };
};

exports.create = async (req, res) => {
    let user = await User.findByPk(req.params.userID) 
    if(user == null) {
     return res.status(404).json({ success: false, msg:`Cannot find any user with ID ${req.params.userID}.`})
    }
    // let chat = await Chat.findOne({
    //     where: ({ id_user1: req.body.id_user1 } && { id_user2: req.body.id_user2}),
    //   });
    //   if (chat) return res.status(422).json({success:false, message: "Chat already exists!" });
 
     try {
         let newChat = await Chat.create({
            id_user1 : req.body.id_user1,
            id_user2 : req.body.id_user2,
 
         })
         res.status(201).json({ success: true, msg:"New chat created", URL: `/chats/${newChat.id}` })
     }
     catch (err) {
         // console.log(err.name) // err.name === 'SequelizeValidationError'
         if (err instanceof ValidationError)
             res.status(400).json({ success: false, msg: err.errors.map(e => e.message) });
         else
             res.status(500).json({
                 success: false, msg: err.message || "Some error occurred while creating the chat."
             });
     };
 };