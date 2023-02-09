let mongoose = require("mongoose")

let ProductSchema = new mongoose.Schema({
    Price:Number,
    Description:String,
    Title:String,
    Brand : String ,
    Category : String ,
    Image:String,
    author : {type : mongoose.Schema.Types.ObjectId,ref:'User'},
    Review: [{type : mongoose.Schema.Types.ObjectId , ref:'Review'}]
})



let Product = mongoose.model('product',ProductSchema)  

module.exports = Product

