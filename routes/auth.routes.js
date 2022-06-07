
const express = require('express');
const authController = require("../controllers/auth.controller");
let router = express.Router();

/*router.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next()
})*/

router.use((req, res, next) => {
    const start = Date.now();
    //compare a start time to an end time and figure out how many seconds elapsed
    res.on("finish", () => { // the finish event is emitted once the response has been sent to the client
        const end = Date.now();
        const diffSeconds = (Date.now() - start) / 1000;
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next()
})


router.route('/signup')
    .post(authController.signup);

router.route('/signin')
    .post(authController.signin)

router.all('*', function (req, res) {
    res.status(404).json({ message: 'AUTHENTICATION: what???' });
})
module.exports = router;