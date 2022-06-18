const express = require('express');

const projectController = require("../controllers/project.controller");
const commentsProjectRouter = require("../routes/commentsProject.routes");

// express router
let router = express.Router();

router.use((req, res, next) => {
    const start = Date.now();
    //compare a start time to an end time and figure out how many seconds elapsed
    res.on("finish", () => { // the finish event is emitted once the response has been sent to the client
        const end = Date.now();
        const diffSeconds = (Date.now() - start) / 1000;
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})

router.route('/')
    .get(projectController.findAll)
    .post(projectController.create);

router.route('/:projectID')
    .get(projectController.findOne)
    .put(projectController.update)
    .delete(projectController.delete);

router.use('/:projectID/commentsProject', commentsProjectRouter);

router.all('*', function (req, res) {
    //send an predefined error message 
    res.status(404).json({ message: 'Buckle: what???' });
})

module.exports = router;