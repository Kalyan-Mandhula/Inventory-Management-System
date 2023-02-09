let mongoose = require("mongoose")
let passportLocalMongoose = require("passport-local-mongoose")


let UserSchema = new mongoose.Schema({
    email :{
        type : String ,
        required : true ,
        unique : true 
    },
    username :{
        type :String ,
        required : true ,
        unique : true
    }

})

UserSchema.plugin(passportLocalMongoose)


module.exports = mongoose.model('User',UserSchema)
