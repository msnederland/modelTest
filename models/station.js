const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
	stationName: {type: String, required: true},
	mac: {type: String, required: true},
	temperature: [{partitionDay: Date, readings: [{when: Date, value: Number}]}],
	humidity: [{partitionDay: Date, readings: [{when: Date, value: Number}]}],
	stationOf:{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
})

module.exports = mongoose.model('Station', stationSchema);
	