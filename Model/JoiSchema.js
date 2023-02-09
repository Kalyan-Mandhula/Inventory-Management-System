
let Joi = require("joi")


module.exports.ProductSchemaValidator = Joi.object({
    product : Joi.object({
        Title : Joi.string().required() ,
        Image : Joi.string().required() ,
        Category : Joi.string().required(),
        Brand : Joi.string().required(),
        Description:Joi.string().required(),
        Price:Joi.number().required()
    }).required() 
})

module.exports.ReviewSchemaValidator = Joi.object({
    review :Joi.object({
        Comment :Joi.string().required(),
        Rating :Joi.number().required()
    }).required()
})


