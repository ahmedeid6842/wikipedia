const mongoose = require('mongoose');
const express = require('express');
const app = express();

mongoose.connect('mongodb://localhost/wikipedia')
    .then(console.log('connected successfuly'))
    .catch((err) => console.log(err.message));

//set enviroment variables

const research = require('./routes/research');
const reactions = require('./routes/reactions');
const register = require('./routes/register');
const login = require('./routes/login');

app.use(express.json());
app.use('/research', research);
app.use('/reactions', reactions);
app.use('/register', register);
app.use('/login', login);


app.listen(3000, console.log('listening to port 3000'));
