const express = require('express');

const messageController = require("../controllers/messages.controller");

// express router
let router = express.Router({mergeParams: true});

router.route('/')
    .get(messageController.findAll)
    .post(messageController.create);

router.route('/:messageID')
    .get(messageController.findOne)
    // .put(chatController.update)
    // .delete(chatController.delete);

router.all('*', function (req, res) {
    //send an predefined error message 
    res.status(404).json({ message: 'Buckle: what???' });
})

module.exports = router;