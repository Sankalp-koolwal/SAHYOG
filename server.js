var express = require('express');
var app = express();

var mongoose = require('mongoose');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var session = require('express-session');

var userRoutes = require("./app/routes");    //inporting routes file...

app.use(session({secret: 'anystringoftext',
				 saveUninitialized: true,
				 resave: true}));


app.use(flash());
app.use(express.static(__dirname + "/public"));		//to connect main.css...
app.use(bodyParser.urlencoded({extended: false}));


app.use(function(req, res, next){
	res.locals.message = req.flash("message");
	res.locals.error_message = req.flash("error");
	res.locals.success_message = req.flash("success");
	next();
});


app.set('view engine', 'ejs');

// ============================================================================================================================

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/disaster';
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connection.on('connected', function(){
	console.log("mongoose is connected!!!");
});

//=============================================================================================================================


app.use(userRoutes);

app.listen(process.env.PORT || 8000, function(){
	console.log('Aap ki manzil ka safar port 8000 se ho kr jata hai!!!');
});

