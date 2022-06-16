const db = require("../models/index.js");
const Chat = db.chat;
const Message = db.message;

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
        let messages = await Message.findAndCountAll({ where: condition, offset })
    
        res.status(200).json({
            success: true,
            totalItems: messages.count,
            messages: messages.rows,
            currentPage: page ? page : 0
        });
    }
    catch (err) {
        res.status(500).json({
            success: false, msg: err.message || "Some error occurred while retrieving the Messages."
        })
        
    }
};

exports.findOne = async (req, res) => {
    try {
        let message = await Message.findByPk(req.params.chatID)

         if (message === null)
            res.status(404).json({
                success: false, msg: `Cannot find any message with ID ${req.params.messageID}.`
            });
        else
            res.json({ success: true, message: message });
    }
    catch (err) {
        res.status(500).json({
            success: false, msg: `Error retrieving message with ID ${req.params.messageID}.`
        });
    };
};

exports.create = async (req, res) => {
    let chat = await Chat.findByPk(req.params.chatID) 
    if(chat == null) {
     return res.status(404).json({ success: false, msg:`Cannot find any chat with ID ${req.params.chatID}.`})
    }
    // let message = await Message.findOne({
    //     where: ({ id_chat: req.body.id_chat} && { id_user: req.body.id_user}),
    //   });
    //   if (message) return res.status(422).json({success:false, message: "Message already exists!" });
 
     try {
         let newMessage = await Message.create({
            id_chat : req.body.id_chat,
            id_user : req.body.id_user,
            text : req.body.text,
            date : new Date()
         })
         res.status(201).json({ success: true, msg:"New message created", URL: `/messages/${newMessage.id}` })
     }
     catch (err) {
         // console.log(err.name) // err.name === 'SequelizeValidationError'
         if (err instanceof ValidationError)
             res.status(400).json({ success: false, msg: err.errors.map(e => e.message) });
         else
             res.status(500).json({
                 success: false, msg: err.message || "Some error occurred while creating the message."
             });
     };
 };