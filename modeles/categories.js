const mongoose = require("mongoose");
const Joi = require("joi");

const Schema = mongoose.Schema({
    title:String,
    image:String, 
});




module.exports.Categories  = mongoose.model("Categories", Schema);

const validate = (data) => {
    const schema = Joi.object({
        image:Joi.string(),
        title:Joi.string().trim().required().label("title"),
    })

return schema.validate(data);

};

module.exports.validate = validate;


