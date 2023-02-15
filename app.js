require('express-group-routes');
var express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
global.app = express(); 
process.env.TZ = 'Asia/Calcutta' 

require('express-reverse')(app);
global.moment = require('moment');
const expressValidator = require('express-validator');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');   
require("dotenv").config();
const port = process.env.PORT || "8000";
console.log("Test");
// Required module 
app.use(expressValidator());
app.use(cors()); 
app.use(fileUpload()); 

global.connectPool = require('./config/db.js');    
  
// Constants 
global.nodeSiteUrl = process.env.SITE_URL; // node  
global.SiteUrl = process.env.SITE_URL; // node  
global.nodeAdminUrl = process.env.ADMIN_URL; // node  
global.siteTitle = process.env.SITE_NAME;
global.SiteName = process.env.SITE_NAME;
global.rootpath = __dirname;
global.successStatus = 200;
global.failStatus = 401; 
global.SessionExpireStatus = 500; 

/* Admin section code */
app.set('view engine', 'ejs');
//app.set('view engine', 'pug') 
var path = require('path');
app.set('views', path.join(__dirname, 'views'));  
app.use(express.static(__dirname +'/public'));  
var flash = require('express-flash-messages')
app.use(flash())
 
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
app.use(cookieParser()); 
app.use(expressSession({secret: 'D%$*&^lk32', resave: false,saveUninitialized: true}));  

app.use(function (req, res, next) {
    res.header('Content-Type', 'application/json');
    next();
});   
app.use(bodyParser.json());  
app.use(express.urlencoded({limit: '100mb',extended: true })); 
  
app.get('/', (req, res) => {
    let isAjaxRequest = req.xhr;
    if(isAjaxRequest)
        res.json({"message": "Welcome to "+SiteName});

    res.json({"message": "Welcome to "+SiteName});
});


require('./routes/api_v1')

app.use('*', (req, res) => {
  res.status(404).json({
    success: 'false',
    message: 'Page not found',
    error: {
      statusCode: 404,
      message: 'You reached a route that is not defined on this server',
    },
  });
});

var server = app.listen(port, function () {
    //console.log("Server running on port %s", server.address().port);
    console.log("Server running on port "+process.env.SITE_URL, server.address().port);
});  
