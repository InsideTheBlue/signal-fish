(function(){
	//constructor of the ApiHandler
	function ApiHandler(sf){
		this.signalFish = sf;
	}

	//the meat and potatoes
	//called each time the server receives a request
	ApiHandler.prototype.handleRequest = function(req,res){
		//need to split the url as the request object
		//contains an array called params, but unfortunately
		//this array contains only one element with the suburl
		//everything after the /api/
		var location = req.params["0"].split('/');
		//big switch based on the base location
		switch(location[0]){
			//start the autonomous mode in the SignalFish
			case("start"):
				this.signalFish.setStart(true);
				res.send(200,"{'status':'ok'}");
				break;
			//stop the autonomous mode in the signalFish
			case("stop"):
				this.signalFish.setStart(false);
				res.send(200,"{'status':'ok'}");
				break;
			//used for logging purposes and the 
			//SensorsView page of the website
			case("data"):
				var data = this.signalFish.getData();
				res.json(data);
				break;
			//vertical motor input
			//controls up and down movement
			case("lift"):
				//this.signalFish.setOverride(true);
				this.signalFish.addLift(location[1]);
				res.send(200,"{'status':'ok'}");
				break;
			//horizontal motor movement
			//controls forwards and backwards
			//and turning left and right
			case("thrust"):
				//this.signalFish.setOverride(true);
				this.signalFish.addThrust(location[1],location[2]);
				res.send(200,"{'status':'ok'}");
				break;
			//input event enables and disables the web override
			//this acts as a safety so that if some lift or thrust
			//calls arrive after the stop event has occurred. In this
			// case these lift/thrust events will be ignored.
			case("input"):
				// api/input/start
				if(location[1] == "start"){
					this.signalFish.setOverride(true);
				// api/input/stop
				}else{
					this.signalFish.setOverride(false);
				}
				res.send(200,"{'status':'ok'}");
				break;
			// whatever the current height,
			// tell the signalfish, this should be the required height
			case("set"):
				if(location[1] == "height"){
					this.signalFish.setHeight();
				}
				res.send(200,"{'status':'ok'}");
				break;
			default:
			// the default response is 404, not found
				res.send(404,"{'status':'error','message':'invalid endpoint"+req.url+"'");
		}
	}



	module.exports = ApiHandler;
})();


