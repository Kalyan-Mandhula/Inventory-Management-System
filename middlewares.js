
let Product = require("./Model/Product")
let Review = require("./Model/Review")
let {ProductSchemaValidator,ReviewSchemaValidator} = require("./Model/JoiSchema")
let ExpressError = require("./ErrorHandling/ExpressError")

module.exports.isLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) { 
        req.session.returnTo = req.originalUrl
        req.flash('error', 'Login to view Campgrounds');
        return res.redirect('/inventory/login');
    }
    next();
}

module.exports.isAuthor = async (req,res,next)=> {
    let {id}=req.params 
    let Obj = await Product.findById(id)
    if(!(Obj.author.equals(req.user._id))){
        req.flash('error','Sorry you have no permission to delete')
        return res.redirect("/inventory")
    }
    next()
}

module.exports.DataValidator = (req,res,next)=> {
    let {error} = ProductSchemaValidator.validate(req.body)
    if(error){
    throw new ExpressError(404,error.details.map(e=>e.message).join(","))
    }else{
        next(error)
    }
}

module.exports.ReviewValidator = (req,res,next)=>{
    let {error} = ReviewSchemaValidator.validate(req.body)
    if(error){
    throw new ExpressError(404,error.details.map(e=>e.message).join(","))
    }else{
        next(error)
    }
}


module.exports.ValidateUserforReview = async(req,res,next)=>{
    let {Reviewid,id}= req.params 
    let obj = await Review.findById(Reviewid).populate('author').populate('user')
    if(!( obj.user.equals(req.user._id)) && !(obj.author.equals(req.user._id))){
          req.flash('error',"You can't delete review")
          return res.redirect("/inventory/"+id+"/show")
    }
    next()
}







