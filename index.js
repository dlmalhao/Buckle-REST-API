require('dotenv').config();         // read environment variables from .env file
const express = require('express'); 
const cors = require('cors');       // middleware to enable CORS (Cross-Origin Resource Sharing)

const app = express();
const port = process.env.PORT;	 	
const host = process.env.HOST;

app.use(cors()); //enable ALL CORS requests (client requests from other domain)
app.use(express.json()); //enable parsing JSON body data

// root route -- /api/
app.get('/', function (req, res) {
    res.status(200).json({ message: 'home -- BUCKLE api' });
});

// routing middleware (mounted on /tutorials route)
app.use('/users', require('./routes/user.routes.js'))

// routing middleware (mounted on /projects route)
app.use('/projects', require('./routes/project.routes.js'))

// routing middleware (mounted on /tutorials route)
app.use('/annoucements', require('./routes/annoucement.routes.js'))

// routing middleware (mounted on /tutorials route)
app.use('/comments', require('./routes/comment.routes.js'))

// routing middleware (mounted on /tutorials route)
app.use('/auth', require('./routes/auth.routes.js'))



// handle invalid routes
app.get('*', function (req, res) {
	res.status(404).json({ message: 'WHAT???' });
})
app.listen(port, host, () => console.log(`App listening at http://${host}:${port}/`));
