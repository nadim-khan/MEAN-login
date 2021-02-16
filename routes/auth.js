const express = require('express');
const router = express.Router();
const User = require('../models/User');
const validate = require('../validation');
const bcrypt = require('bcrypt');
const chalk = require('chalk');
const jwt = require('jsonwebtoken');
const config = require('../config/config');


router.post('/register',async(req,res)=>{
    //Checking for validation error
    const {error} = validate.registerValidation(req.body);
    if(error){
        console.log(chalk.red(error))
        return res.status(404).send(error);
    }

    //Checking if emailhas been registered already
    const emailExist = await User.findOne({email:req.body.email});
    if(emailExist){
        console.log(chalk.red(`User has already been registered with email : ${req.body.email}`))
        return res.status(404).send(`User has already been registered with email : ${req.body.email}`);
    }

    //generating Hash the password
    const salt = await bcrypt.genSalt(10); //create a mummble of text only bcrypt can decrypt
    const hashedPassword = await bcrypt.hash(req.body.password,salt);

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save();
        console.log(chalk.greenBright('User registed : ',savedUser))
        res.send(savedUser);
    } catch (err){
        console.log(chalk.red(err));
        res.status(400).send(err);
    }
});

router.post('/login',async(req,res)=>{
    const {error} = validate.loginValidation(req.body);
    if(error){
        console.log(chalk.red(error));
        return res.status(404).send(error.details[0].message);
    }

    //Checking if emailexist
    const user = await User.findOne({email:req.body.email});
    if(!user){
        console.log(chalk.red(`Email  ${req.body.email} doesnt exist!`))
        return res.status(404).send(`Email  ${req.body.email} doesnt exist!`);
    }
    const validPassword = await bcrypt.compare(req.body.password,user.password);
    if(!validPassword) {
        console.log(chalk.red(`Incorrect password`))
        return res.status(404).send(`Incorrect password`);
    } else {
        //create and assign a token
        const token = jwt.sign({_id:user._id},config.jwtsecret);
        res.header('auth-token',token).send(token);
        console.log(chalk.green(`User logged In :token`))
       // res.status(200).send(user);
    }
});

module.exports = router;