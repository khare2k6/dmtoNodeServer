
var express=require('express');
//required for sending authentication email
var nodemailer = require("nodemailer");
var app=express();
//required for mongoose db connection
var db = require('./db');
var UserModel = require('./schemas/userSchema');
var CompanyModel = require('./schemas/companySchema');
var TechParkSchema = require('./schemas/techparkSchema');

app.listen(3300,function(){
	console.log("Express Started on Port 3300");
});


/****************************************FUNCTION::sendAuthenticationEmail/**********************/
var sendAuthenticationEmail = function(email,code){
var api_key = 'key-7641e1ba7bddcc98ee4c874fd7d95d49';
var domain = 'sandboxf563df2c8bd84b4c930cda6bf6657f86.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

console.log('attempting to send eamil to:'+email);
var data = {
  from: 'DMTO Signup <signup@dmto.com>',
  to: email,
  subject: 'Authenticate your registration with dmto',
  html:'<p>Hi,</p>Your authentication code is:<b>'+code+'</b>. Please enter the same in the app to continue<p>Thanks,</p><p><b>DMTO Team</b></p>'
};
 
mailgun.messages().send(data, function (error, body) {
  console.log(body);
});
}

app.get('/sendemail',function(req,res){
	sendAuthenticationEmail('khare2k6@gmail.com')
	res.status(200);
});


/****************************************FUNCTION::signup/**********************/
app.post('/signup',function(req,res){
	var body ="";
		var jsonObj={};
		req.on('data',function(chunk){
			body += chunk;
		});

		//var email,password;
		var info = {};

		req.on('end',function(){
			 jsonObj = JSON.parse(body);
			  info.email = jsonObj.email;
			  info.password = jsonObj.password;
			 console.log('username:'+info.email+' password:'+info.password);

			 			//if email or password is blank,return an error
			if(info.email === 'undefined'|| info.password === 'undefined'){
				res.status(200).json({status:"Email or pwd cannot be blank"});
				return;
			}

			//Search in db if this email already exists
			UserModel.findOne({'email':info.email},function(err,user){
				console.log('user foudn:'+user);
				if(user !== null){
					res.status(404).json({status:'Username already exists'});
					return;
				}
				//no matching records exist, lets generate authentication code for this user
				info.securityCode = Math.floor(Math.random() * (9999 - 1000) + 1000);
				info.isAuthenticated = 0;
				console.log('authentication code:'+info.securityCode);
				sendAuthenticationEmail(info.email,info.securityCode);
				//lets save this entry in the db
				var record = new UserModel(info);
				record.save(function(err) {
				if(err){
					console.error(err);
					res.status(401).json({status: 'failure'});
				}else {
					console.log("save success..");
					// UserSchema.find(function (err, users) {
		 		// 	 if (err) return console.error(err);
		  	// 			console.log(users)
					// });
					//res.json({status: 'success'});
					}
				});

				res.status(200).json({status: 'done'});
			});
			});

	});

/****************************************FUNCTION::addNewCompany/**********************/
app.post('/addNewCompany',function(req,res){
		var body ="";
		var jsonObj={};
		req.on('data',function(chunk){
			body += chunk;
		});

	
		req.on('end',function(){
			 jsonObj = JSON.parse(body);
			 console.log('companyName to be added:'+jsonObj.companyName);

		//check if this company name exists in db
		CompanyModel.findOne({'companyName':jsonObj.companyName},function(err,cmp){
				console.log('company found:'+cmp);
				if(cmp !== null){
					res.status(404).json({status:'Name already in the DB'});
					return;
				}else{
				//company name doesn't exist in db, save it
				var record = new CompanyModel(jsonObj);
				record.save(function(err) {
				if(err){
					console.error(err);
					res.status(401).json({status: 'failure'});
				}else {
					console.log("save success..");
					res.status(200).json({status:'success'});
					}

				});
			}
		});
			});

	});

/****************************************FUNCTION::AuthenticateUser/**********************/
app.post('/authenticateUser',function(req,res){
		var body ="";
		var jsonObj={};
		req.on('data',function(chunk){
			body += chunk;
		});

	
		req.on('end',function(){
			 jsonObj = JSON.parse(body);
			 console.log('email:'+jsonObj.email+' code:'+jsonObj.securityCode);

			 		//Search this username in db and its security code.
		UserModel.findOne({'email':jsonObj.email},function(err,user){
			if(err !== null){console.log('error occured:'+err);}
			console.log('user foudn:'+user);
			if(user === null){
				res.status(404).json({status:'No such email exists in db'});
				return;
			}
			//User exists, check if security code matches with the one stored in db
		console.log('user found code:'+user.securityCode+' ,received in API:'+jsonObj.securityCode);
		if(user.securityCode === jsonObj.securityCode){
			res.status(200).json({status:'success'});
		}else{
			res.status(401).json({status:'failed'});
		}	

		});
			});
			

		
});