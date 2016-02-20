var db = require('../db');
var mongoose = db.mongoose_var;

var companySchema = mongoose.Schema({
	companyName:String
});


module.exports = mongoose.model('Company',companySchema);