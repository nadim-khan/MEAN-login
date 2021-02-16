const express = require('express');
const chalk = require('chalk');
const config = require('./config/config');
const mongoose = require('./config/mongoose');

const port = process.env.PORT || 8000;

const app = express();

//Import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

//Route Middleware
app.use(express.json());
app.use('/api/user',authRoute);
app.use('/api/posts',postRoute);

app.listen(port,(err)=>{
    if(!err){
        console.log(chalk.yellow(`Server started on port ${port}`));
    } else {
        console.log(chalk.red('Error : ',err));
    }
})