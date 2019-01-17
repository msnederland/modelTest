const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	userName: {type: String, required: true, unique: true},
	apiKey:{type: String, required: true, unique: true},
	stations:[{type: mongoose.Schema.Types.ObjectId, ref: 'Station', StationName: String}]
})

module.exports = mongoose.model('User', userSchema);
