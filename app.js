const express=require("express") 
const app = express() ;

// UserSchema
let User = require("./Model/User") 

let localStorage = require("passport-local")
let passport = require("passport")

const path = require("path")
app.set("views",path.join(__dirname,"views"))

// Embedded JavaScript (EJS)
app.set("view engine","ejs")
let ejsMate = require("ejs-mate")
app.engine('ejs',ejsMate)


let methodOverride = require('method-override')
app.use(methodOverride('_method'))
app.use(express.json());

// body-parser
app.use(express.urlencoded({extended:true}))


// Schema Routes
let Product = require("./Routes/Product")
let ReviewRoute = require("./Routes/Review")
let UserRoute = require("./Routes/User")


// Connecting to MongoDB
let mongoose= require("mongoose")
mongoose.set('strictQuery',true);
mongoose.connect("mongodb://localhost:27017/Inventory",{useNewUrlParser: true})
.then(()=>console.log("MONOGOOSE CONNECTED :)"))

// session
let session = require("express-session")
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  }))
  
let flash = require("connect-flash");
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStorage(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req,res,next)=>{
    res.locals.CurrentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

// Routes for different Schemas
app.use("/inventory",Product)
app.use("/inventory",ReviewRoute)
app.use("/inventory",UserRoute)

app.get("/",(req,res)=>{
    res.render("./Home")
})

app.listen(3003,()=>{
    console.log("SERVER STARTED !!!")
})

app.use((err,req,res,next)=>{
    let {statusCode=404,message="Something"} = err ;
    res.status(statusCode).render("./BootStrap/ErrorTemplate",{err})
})

