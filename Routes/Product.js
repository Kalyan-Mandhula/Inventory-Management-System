const express=require("express")
let router = express.Router() ;
let Product = require("../Model/Product");
let Review = require('../Model/Review')

let Categories = ["Food","Clothes","Footwear","Electronics","Stationery","Furniture","Sports"] ; 

let CatchError = require("../ErrorHandling/CatchError")

let {isLoggedIn,isAuthor,DataValidator} = require("../middlewares") 


// get entire list

router.get("/",isLoggedIn,CatchError(async (req,res)=>{
    let List = await Product.find({})
    let name = ""
    res.render("./List",{List,name})
}))

// Add item

router.post("/",isLoggedIn,DataValidator,CatchError(async (req,res)=>{   
    let product = new Product(req.body.product)
    product.author= req.user ,
    await product.save()
    req.flash('success','Succesfully added a Product') 
    console.log(product)
    res.redirect(`/inventory/${product._id}/show`)
}))

// get item 

router.get("/:id/show",isLoggedIn,CatchError(async (req,res)=>{
    let {id}=req.params
    let product = await Product.findById(id).populate({
        path :'Review',
        populate :{
            path:'user'
        }
        
    }).populate('author')
    if(!product) {
        req.flash('error','Product doesnot exist')
        return res.redirect("/inventory")
    } 
    
    res.render("./show",{product})
}))


// Edit item
router.put("/:id",isLoggedIn,isAuthor,DataValidator,CatchError(async (req,res)=>{
    let {id}=req.params 
    let obj = await Product.findByIdAndUpdate(id,{...req.body.product},{new:true})
    req.flash('success','Succesfully Updated') 
    res.redirect(`/inventory/${id}/show`)

}))


// Delete item
router.delete("/:id",isLoggedIn,isAuthor,CatchError(async (req,res)=>{
    let {id}=req.params 
    let product = await Product.findByIdAndDelete(id,{new:true})
    await Review.deleteMany({
        _id :{$in :product.Review}
    })
    req.flash('success','Succesfully Deleted A Product') 
    res.redirect("/inventory")
}))


// Edit page
router.get("/:id/EditProduct",isLoggedIn,isAuthor,CatchError(async (req,res)=>{
    let {id} = req.params
    let Obj = await Product.findById(id)
    console.log(Obj)
    res.render("./EditProduct" ,{Obj,Categories})
}))

// Add product page
router.get("/AddProduct",isLoggedIn,(req,res)=>{
    res.render("./AddForm",{Categories})
})





// view category page
router.get("/ViewByCategory",isLoggedIn,CatchError(async (req,res)=>{   
    res.render("./Categories.ejs",{Categories})
}))

router.get("/ProductsOfCategory",isLoggedIn,CatchError(async (req,res)=>{   
    let category = req.query.category 
    let List = await Product.find({Category:category}) 
    let name = ""+category
    res.render("./List",{List,name})
}))

router.get("/AddCategory",isLoggedIn,CatchError(async (req,res)=>{   
    res.render("./AddCategory")
}))

router.get("/DeleteCategory",isLoggedIn,CatchError(async (req,res)=>{ 
    let category = req.query.category
    await Product.deleteMany({Category:category})
    Categories = Categories.filter(function (ele) {
        return ele !== category;
    });  
    res.render("./Categories.ejs",{Categories})
}))

router.post("/AddCategory",isLoggedIn,CatchError(async (req,res)=>{   
    let category = req.body.category
    if(!Categories.includes(category,0)){
        Categories.push(category)
        res.render("./Categories.ejs",{Categories})
    }
    else{
        req.flash('error','Category alreay exist')
        res.redirect("./ViewByCategory")
    }
}))




module.exports = router








