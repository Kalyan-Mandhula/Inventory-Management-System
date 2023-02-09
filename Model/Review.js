let mongoose = require('mongoose')

let ReviewSchema = new mongoose.Schema({
    Comment  :String ,
    Rating : Number,
    user : {type : mongoose.Schema.Types.ObjectId , ref:'User' },
    author :{type : mongoose.Schema.Types.ObjectId , ref:'User'}
})

let Review = mongoose.model('Review',ReviewSchema)

module.exports = Review



