
const mongoose = require('mongoose');
var DateOnly = require('mongoose-dateonly')(mongoose);

const Station = require('./models/station');
const User = require('./models/user');
var moment = require('moment-timezone');
moment().tz("Europe/Amsterdam").format();


console.log("starting");
mongoose.connect('mongodb://localhost:27017/stationTest');

//User.create({userName: "Thomas", apiKey: "112233"});

//lookForStations();

console.log("----------------------------------")

//addStation()

//lookForUsers("Thomas")

updateStation("kantoor25", "112233");
//deleteStation("kantoor25", "112233");

//findOnDate();

function lookForUsers(name) {
	User.find({userName: name}).
	populate('stations').
	exec().
	then(results =>{
		console.log({message: "Looked for Users", results:results});
	}).
	catch(err => {
		console.log(err)
	})
}

function lookForStations() {
	Station.find().
	//populate('stationOf', 'apiKey macAddresses').
	exec().
	then(results =>{
		console.log({message: "Looked for stations", results: results});
	}).
	catch(err => {
		console.log(err)
	})
}

function findOnDate() {

	Station.findOne({'temperature.when': '2017-12-31T23:00:00.000Z'}).
	exec().
	then(result=> {
		console.log({message: "I think we found something", result: result})
	}).
	catch(err => {
		console.log(err)
	})
}

function updateStation(station, apiKey) {

	const request = {
		station: station,
		apiKey: apiKey,
		temperature: 20,
		when: '2019-01-21T01:00:00Z',
	}	

	console.log(request)

	const partitionDay = moment.utc(request.when).startOf('day').format()
	console.log(partitionDay)



	Station.findOne({stationName: station}).
	populate('stationOf', 'apiKey').
	exec().
	then(result =>{

		if(result){

			if(result.stationOf.apiKey == request.apiKey) {

				console.log("I can do this for you")
				const partitionDay = moment.utc(request.when).startOf('day').format()

				Station.findOne({stationName: station, 'temperature.partitionDay': partitionDay}).
				exec().
				then(result =>{
					console.log("MOTHERFUCKING RESULT");
					console.log(result);
					if(result){
						console.log("FIRED WITH RESULT")
						Station.findOneAndUpdate({'temperature.partitionDay': partitionDay}, {$push: {'temperature.$.readings': {when:request.when, value: request.temperature}}}).
						exec().
						then(result =>{
							//console.log(result)	
						}).
						catch(err =>{
							console.log(err)
						})	
					}else if(!result){
						console.log("FIRED WITHOUTTTTT RESULT")
						Station.findOneAndUpdate({stationName: station}, {$push: {'temperature': {partitionDay: partitionDay, readings: {when: request.when, value: request.temperature}}}}).
						exec().
						then(result =>{
							console.log(result)	
						}).
						catch(err =>{
							console.log(err)
						})	

					}
					console.log("updated station")
				}).
				catch(err => {
					console.log({message:"error while updating station", error: err})
				})

			} else if(result.stationOf.apiKey != request.apiKey) {
				console.log("No way dude, not your station")
			}

		} else {
			console.log("Didn't find station")
		}
	
	}).
	catch(err => {
		console.log({message: "this ended in disaster",error: err})
	})

}



/*
function updateStation(station, apiKey) {

	const request = {
		station: station,
		apiKey: apiKey,
		temperature: 20,
		when: moment('01-01-2018')
	}



	Station.findOne({stationName: station}).
	populate('stationOf', 'apiKey').
	exec().
	then(result =>{

		if(result){

			if(result.stationOf.apiKey == request.apiKey) {

				console.log("I can do this for you")

				Station.findOneAndUpdate({_id: result.id, 'temperature.when': request.when}, {$set: {temperature: request.temperature}}, {new:true}).
				exec().
				then(result =>{
					console.log("updated station")
				}).
				catch(err => {
					console.log({message:"error while updating station", error: err})
				})

			} else if(result.stationOf.apiKey != request.apiKey) {
				console.log("No way dude, not your station")
			}

		} else {
			console.log("Didn't find station")
		}
	
	}).
	catch(err => {
		console.log({message: "this ended in disaster",error: err})
	})

}

*/

function addStation() {

	const user = {
		apiKey: "112233"
	}

	const deviceMac = "11:22:66"

	User.findOne({apiKey: user.apiKey, macAddresses:{$ne: deviceMac}}).
	exec().
	then(user =>{

		if(user) {

			const station = {
				stationName: "kantoor25",
				mac: deviceMac,
				stationOf: user._id
			}

			console.log({message:"Found user, and mac is unique", result: user})

			Station.create(station).
			then(result => {
				User.findByIdAndUpdate(user._id,{$push: {stations:result._id, macAddresses: station.mac}}, {new:true}).
				exec().
				then(result => {
					console.log({message:"Result of adding MAC Address to unique list", result: result})
				}).
				catch(err=> {
					console.log({message:"error adding MAC Address to unique list", result: result})
				})
					console.log({message: "Added station", results: result, stationId: result._id})
				}).
				catch(err =>{
					console.log({message: "Error adding station", error: err})
				})

		} else if(!user) {

			console.log({message: "Looked for user, and found mac or no apikey"})
			console.log("----------------------------------")

		}
	}).
	catch(err =>{
		console.log({message: "Error looking for user", error: err})
	})
}

function deleteStation(station,apiKey) {
	
	const request = {
		station: station,
		apiKey: apiKey,
		temperature: 20
	}

	Station.findOne({stationName: station}).
	populate('stationOf', 'apiKey macAddresses' ).
	exec().
	then(result =>{

		if(result){

			if(result.stationOf.apiKey == request.apiKey) {

				console.log("I can do this for you")
				console.log(result)

				Station.findOneAndDelete({_id: result.id}).
				exec().
				then(result =>{
					console.log("deleted station")
				}).
				catch(err => {
					console.log({message:"error while deleting station", error: err})
				})
				
				User.findByIdAndUpdate(result.stationOf._id,{$pull: {macAddresses: result.mac}}).
				exec().
				then(result =>{
					console.log({message: "Result of delting mac from list of unique macs", results: result})
				}).
				catch(err => {
					console.log({message:"error while deleting station", error: err})
				})
				

			} else if(result.stationOf.apiKey != request.apiKey) {
				console.log("No way dude, not your station")
			}

		} else {
			console.log("Didn't find station")
		}
	
	}).
	catch(err => {
		console.log({message: "this ended in disaster",error: err})
	})
}