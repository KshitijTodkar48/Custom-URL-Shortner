const express = require("express") ;
const path = require("path") ;
const app = express() ;
const PORT = 8001 ;
const cookieParser = require("cookie-parser") ;
const URL = require("./models/url") ;

const urlRoutes = require("./routes/url") ;
const staticRoute = require("./routes/staticRouter") ;
const userRoutes = require("./routes/user") ;

const { connectToMongoDB } = require("./connection") ;
const { checkForAuthentication , restrictTo } = require("./middlewares/auth") ;

connectToMongoDB("mongodb://127.0.0.1:27017/url-shortner")
.then(() => console.log("MongoDB connected.") ) ;

app.set("view engine","ejs") ;

app.set("views", path.resolve("./views")) ;

app.use(express.json()) ; // It is a Middleware that parses incoming JSON requests and
// puts the parsed data in req.body. It also allows the server to process the data submitted
// by user if it is in JSON format.
// Without `express.json()`, `req.body` is undefined.

app.use(express.urlencoded({extended: false})) ; 
// It allows the server to process the data submitted by user if it is a form-data.

app.use(cookieParser()) ;
// It is a middleware used to parse Cookies.

app.use(checkForAuthentication) ;

app.use("/url", restrictTo(["NORMAL","ADMIN"]) , urlRoutes) ;

app.use("/user", userRoutes) ;

app.use("/",  staticRoute) ;

app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId ;
    const entry = await URL.findOneAndUpdate({
        shortId
    },{ $push: {
        visitHistory:{
            timestamps: Date.now(),
        } 
    } })
    res.redirect(entry.redirectURL) ;
})

app.listen(PORT, () => console.log(`Server started at PORT : ${PORT}`)) ;
