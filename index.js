const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoute = require('./app/routes/user.route');
const accountRoute = require('./app/routes/account.route');

require('dotenv').config()

const BASE_URL = '/api/v1'

mongoose.Promise = global.Promise;

mongoose.connect(process.env.DB_HOST, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Error...', err);
    process.exit();
});

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.json({"message": "Server is running :D"});
});

const PORT = process.env.PORT || 8000

// require('./app/routes/user.route')(app);
app.use(`${BASE_URL}/user`, userRoute)
app.use(`${BASE_URL}/account`, accountRoute)

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

module.exports = app