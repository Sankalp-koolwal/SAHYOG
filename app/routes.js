var express = require('express');
var router = express.Router();

var Missing = require('./models/missing');
var Found = require('./models/found');
var Notify = require('./models/notify');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });


// var disas = require('./models/temp');

// disas.create({
//     name: "sankalp",
//     image: "aqr"

// }, function(err, disas) {
//     if(err)
//         console.log(err);
//     else 
//     {
//         console.log("newly created disaster");
//         console.log(disas);
//     }
// });



router.post('/reportMissing', function(req, res){
  var rand = Math.floor((Math.random()*1000)+1).toString();
  var id = req.body.r_contact1 + "@" + rand;
  var report = new Missing({
    reporter_ID: id,
    reporter_name : req.body.r_name,
    reporter_contact1: req.body.r_contact1,
    reporter_contact2: req.body.r_contact2,
    reporter_address: req.body.r_address,
    reporter_pincode: req.body.r_zip,
    reporter_relation: req.body.r_relation,
    reporter_email: req.body.r_email,
    missing_name: req.body.m_name,
    missing_contact: req.body.m_contact ,
    missing_address: req.body.m_address,
    missing_state: req.body.m_state,
    missing_city: req.body.m_city,
    missing_pincode: req.body.m_zip,
    missing_description: req.body.m_description,
    missing_date: req.body.m_date,
    missing_time: req.body.m_time,
    missing_location: req.body.m_location,
    missing_gender: req.body.m_gender,
    missing_age: req.body.m_age,
    missing_photo: req.body.m_photo,
    status: "missing"
  });
  report.save(function(err){
    if (err)
    {
        console.log(err);
        req.flash("error", "qwerty");
        return res.redirect('/reportMissing');
    }
    console.log("Missing person saved successfully");
  });

  req.flash('success', 'Missing person has been successfully added to the database \n Your reference ID is ' + 
              report.reporter_ID +' \n .This should be used for cancelling your reported person' );
  res.redirect('/report');

});



router.post('/reportFound', function(req, res){
  var rand = Math.floor((Math.random()*1000)+1).toString();
  var id= req.body.rf_contact1 + "@" + rand;
  var found = new Found({
    reporter_ID: id,
    reporter_name : req.body.rf_name,
    reporter_contact1: req.body.rf_contact1,
    reporter_contact2: req.body.rf_contact2,
    reporter_address: req.body.rf_address,
    reporter_email: req.body.rf_email,
    found_name: req.body.f_name,
    found_address: req.body.f_address,
    found_state: req.body.f_state,
    found_city: req.body.f_city,
    found_pincode: req.body.f_zip,
    found_description: req.body.f_description,
    found_date: req.body.f_date,
    found_location: req.body.f_location,
    found_gender: req.body.f_gender,
    found_age: req.body.f_age,
    found_photo: req.body.f_photo,
    status: "found"
  });
  found.save(function(err){
    if (err)
    {
        console.log(err);
        return res.redirect('/');
    }
    console.log("Found person saved successfully");
  });

  req.flash('success', 'Found person has been successfully added to the database');
  res.redirect('/report');

});



router.post('/cancelReport', function(req, res){

    if(req.body.cancel_type == "found"){
        Found.findOneAndUpdate({ reporter_ID:req.body.cancel_ID,status:"found"},{$set:{status:"match found"}},function(err, result) {
            if (err)
            {
                console.log(err);
                return res.redirect('/');
            }
            req.flash('success', 'Your reported person has been removed.');
            res.render('report.ejs');
        });
    }
    else if(req.body.cancel_type == "missing"){
        Missing.findOneAndUpdate({reporter_ID:req.body.cancel_ID,status:"missing"},{$set:{status:"match found"}},function(err, result) {
            if (err)
            {
                console.log(err);
                return res.redirect('/');
            }
            req.flash('success', 'Your reported person has been removed.');
            res.render('report.ejs');
        });
    }
    else{res.render('report.ejs');}
});


router.get('/findFound', function(req, res){
    var people_found= [];
    Found.find({ status:"found"},function(err, result) {
        if (err)
        {
            console.log(err);
            return res.redirect('/');
        }
        people_found = result;
        res.render('findFound.ejs', { people_found : people_found });
    });
});


router.get('/profileFound/:id', function(req, res) {
    Found.findOne({ '_id': req.params.id }, function(err, user) {
        if (err)
        {
            console.log(err);
            return res.redirect('/');
        }
        if (!user) 
        {
            req.flash("error", 'No such entry exists in the database.');
            console.log("no entry in database for found");
            return res.redirect('/findFound');
        }
        res.render('profileFound', { profile_found : user });
    });
});


router.get('/findMissing', function(req, res){
    var people_missing = [];
    Missing.find({status: "missing"}, function(err, result){
        if (err)
        {
            console.log(err);
            return res.redirect('/');
        }
        console.log(result);
        people_missing = result;
        res.render('findMissing.ejs', {people_missing : people_missing});
    });
});

router.get('/profileMissing/:id', function(req, res){
    Missing.findOne({'_id' : req.params.id}, function(err, user){
        if (err)
        {
            console.log(err);
            return res.redirect('/');
        }
        if (!user) 
        {
           req.flash('error', 'No such entry exists in the database.');
           console.log("no entry in database for found");
           return res.redirect('/findFound');
        }
        res.render('profileMissing', {profile_missing : user});
    });
});




router.get('/', function(req, res){
	res.render('home.ejs');
});

router.get('/guide', function(req, res){
  	res.render('guide.ejs');
});

router.get('/report', function(req, res){
  	res.render('report.ejs');
});

router.get('/find', function(req, res){
  	res.render('find.ejs');
});

router.get('/reportMissing', function(req, res){
    res.render('reportMissing.ejs');
});

router.get('/reportFound', function(req, res){
    res.render('reportFound.ejs');
});

router.get('/cancel_Report', function(req, res){
    res.render('cancel_Report.ejs');
});


//======================GUIDE===========================


router.get('/avalanche', function(req, res){
  	res.render('avalanche.ejs');
});

router.get('/blizzard', function(req, res){
  	res.render('blizzard.ejs');
});

router.get('/cyclone', function(req, res){
  	res.render('cyclone.ejs');
});

router.get('/volcano', function(req, res){
  	res.render('volcano.ejs');
});

router.get('/earthquake', function(req, res){
  	res.render('earthquake.ejs');
});

router.get('/flood', function(req, res){
  	res.render('flood.ejs');
});

router.get('/landslide', function(req, res){
  	res.render('landslide.ejs');
});

router.get('/tsunami', function(req, res){
  	res.render('tsunami.ejs');
});

//=======================GUIDE===========================


module.exports = router;
