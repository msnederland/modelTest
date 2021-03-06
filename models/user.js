const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	userName: {type: String, required: true, unique: true},
	apiKey:{type: String, required: true, unique: true},
	macAddresses: [String],
	stations:[ {type: mongoose.Schema.Types.ObjectId, ref: 'Station'}]
})

module.exports = mongoose.model('User', userSchema);
