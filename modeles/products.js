const mongoose = require("mongoose");
const Joi = require("joi");

const Schema = mongoose.Schema({
    images:[String],
    name:String,
    discription:String,
    category:String,
    code:String,
    price:String,
    brend:String

});

module,exports.Products  = mongoose.model("Products", Schema);

const validate = (data) => {
    const schema = Joi.object({
        images:Joi.array().label("images"),
        name:Joi.string().required().label("name"),
        discription:Joi.string().required().label("discription"),
        price:Joi.string().required().label("price"),
        category:Joi.string().required().label("category"),
        brend:Joi.string().required().label("brend"),
        code:Joi.string().label("code"),


        
    })

return schema.validate(data);

};

module.exports.validate = validate;

