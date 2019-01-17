
const mongoose = require('mongoose');

const Station = require('./models/station');
const User = require('./models/user');

console.log("starting");
mongoose.connect('mongodb://localhost:27017/stationTest');

User.create({userName: "Thomas", apiKey: "112233"})

//lookForStations();

console.log("----------------------------------")

//addStation()

lookForUsers("Thomas")

//updateStation("slaapkamer", "1234567890");


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
	populate('stationOf', 'apiKey').
	exec().
	then(results =>{
		console.log({message: "Looked for stations", results: results});
	}).
	catch(err => {
		console.log(err)
	})
}

function updateStation(station, apiKey) {

	const request = {
		station: station,
		apiKey: apiKey,
		temperature: 20
	}

	Station.findOne({stationName: station}).
	populate('stationOf', 'apiKey').
	exec().
	then(result =>{
		if(result.stationOf.apiKey == request.apiKey) {
			console.log("I can do this for you")
			Station.findOneAndUpdate({_id: result.id}, {$set: {temperature: request.temperature}}).
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
		console.log({message: "Looked one station", results: result});
	}).
	catch(err => {
		console.log({message: "this ended in disaster",error: err})
	})
}


function addStation() {

	const user = {
		apiKey: "1234567890"
	}

	User.findOne({apiKey: user.apiKey}).
	exec().
	then(user =>{
		console.log({message: "Looked for user", results: user, userid: user._id})
		console.log("----------------------------------")

		const station = {
			stationName: "kantoor",
			mac: "11:22:22",
			stationOf: user._id
		}
		
		Station.create(station).
		then(result => {
			User.findOneAndUpdate({_id: user._id},{$push: {stations:result._id}}).
			exec().
			then(result => {
				console.log({message:"result of updating user", result: result})
			}).
			catch(err=> {
				console.log({message:"error updating user", result: result})
			})
			console.log({message: "Added station", results: result, stationId: result._id})
		}).
		catch(err =>{
			console.log({message: "Error adding station", error: err})
		})

	}).
	catch(err =>{
		console.log({message: "Error looking for user", error: err})
	})
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}