const express = require('express');

const chatController = require("../controllers/chat.controller");
const messageRouter = require("../routes/messages.routes");

// express router
let router = express.Router({mergeParams: true});

router.route('/')
    .get(chatController.findAll)
    .post(chatController.create);

router.route('/:chatID')
    .get(chatController.findOne)
    // .put(chatController.update)
    // .delete(chatController.delete);

router.use('/:chatID/messages', messageRouter);

router.all('*', function (req, res) {
    //send an predefined error message 
    res.status(404).json({ message: 'Buckle: what???' });
})

module.exports = router;