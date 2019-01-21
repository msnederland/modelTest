const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
	stationName: {type: String, required: true},
	mac: {type: String, required: true},
	temperature: [{when: Date, temperature: [{when: Date,reading: Number}]}],
	humidity: [{when: Date, humidity: [{when: Date,reading: Number}]}],
	stationOf:{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
})

module.exports = mongoose.model('Station', stationSchema);
	