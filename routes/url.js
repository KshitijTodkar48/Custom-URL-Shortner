const express = require("express") ;
const router = express.Router() ;
const {handleGenerateNewShortUrl, handleGetAnalytics} = require("../contollers/url") ;

router.post('/' , handleGenerateNewShortUrl) ;

router.get('/analytics/:shortId' , handleGetAnalytics) ;

module.exports = router ;