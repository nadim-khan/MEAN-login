const Joi = require('joi');

const registerValidation = async(requestData) => {
    //Validation
const schema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(6)
        .max(30)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .min(6),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})
try {
    const value = await schema.validateAsync(requestData);
    console.log(value)
    return value;
}
catch (err) { 
    return err;
}
}

const loginValidation = async(requestData) => {
    //Validation
const schema = Joi.object({
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})
try {
    const value = await schema.validateAsync(requestData);
    console.log(value)
    return value;
}
catch (err) { 
    return err;
    //return err;rs
}
}


module.exports = { 
    registerValidation,
    loginValidation
 };
