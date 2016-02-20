var db = require('../db');
var mongoose = db.mongoose_var;

var userSchema = mongoose.Schema({
	email:String,
	password:String,
	securityCode:String,
	isAuthenticated:String,
});


module.exports = mongoose.model('User',userSchema);