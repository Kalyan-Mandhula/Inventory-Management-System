
const express=require("express")
let Reviewrouter = express.Router() ;
let Product = require("../Model/Product");
let Review = require('../Model/Review')

let CatchError = require("../ErrorHandling/CatchError")


let {isLoggedIn,ReviewValidator,ValidateUserforReview} = require("../middlewares") 

// Delete Review

Reviewrouter.delete("/:Reviewid/DeleteReview/:id",ValidateUserforReview,CatchError(async(req,res)=>{
    let {Reviewid,id}= req.params 
    let List = await Product.findByIdAndUpdate(id,{ $pull:{ Review:Reviewid } , new:true }).populate('Review')
    await Review.findByIdAndDelete(Reviewid)
    await List.save() 
    res.redirect("/inventory/"+List._id+"/show")
}))


// Post Review

Reviewrouter.post("/:id/AddReview" ,isLoggedIn, ReviewValidator, CatchError(async (req,res)=>{
    let {id} = req.params 
    List = await Product.findById(id).populate('Review')
    let newReview = new Review(req.body.review)
    newReview.user = req.user 
    newReview.author = List.author
    List.Review.push(newReview)
    await newReview.save()
    await List.save()
    res.redirect("/inventory/"+List._id+"/show")
}))


module.exports=Reviewrouter
