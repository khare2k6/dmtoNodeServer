var db = require('../db');
var mongoose = db.mongoose_var;

var techParkSchema = mongoose.Schema({
	name:String,
	latitude:String,
	longitude:String
});


module.exports = mongoose.model('TechPark',techParkSchema);