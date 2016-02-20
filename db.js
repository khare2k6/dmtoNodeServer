var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dmto');

exports.mongoose_connection = mongoose.connection;
exports.mongoose_var = mongoose;