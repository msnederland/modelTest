const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
	stationName: {type: String, required: true, unique: true},
	mac: {type: String, required: true, unique: true},
	temperature: Number,
	stationOf:{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
})

module.exports = mongoose.model('Station', stationSchema);
