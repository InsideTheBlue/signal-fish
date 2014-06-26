(function(){
	// local reference to Math functions
	// that are used here and there
	var round = Math.round;
	var random = Math.random;

	// constructor
	function SignalFish(){
		//the value that the motors in this.settings.thrust take
		//set between -1 and 1;
		// -1 translates to -255, 1 translates to 255
		// -1 runs the motor backwards, 1 runs it forwards
		var motorValue = 0.125;
		//the motors in the arduino sketch go from 0-255
		//whereas the server thinks in 0-1, so a scale factor is required
		this.scaleNumber = 255;
		// settings for the application
		this.settings = {
			//is someone controlling the blimp via the web interface
			"webOverride": false,
			//the blimp auto-pilot must be enabled with the web interface
			//there is a start button on the web interface
			"started": false,
			//this is a toggle bit
			//when the button is pressed in the web interface it is
			//toggled on for one instruction cycle then turned off again.
			"setAltimeter":0,
			// min time between assessing random walk criteria
			// relates to this.walkCounter
			"walkThreshold": 5000,
			//when it is decided to move forward in the random walk function
			//the minimum time to run the forward thrust
			"minWalkPeriod":10,
			//when it is decided to move forward in the random walk function
			//the maximum time to run the forward thrust
			"longestWalkPeriod": 100,
			//the counter for an active walk
			// when there is an active walk this is set between max and min
			// then decremented at each 100ms interval until it reaches 0
			"activeWalk":0,
			//the total number of led patterns the sketch has
			"ledModes":2,
			// different values for thrust used in autopilot mode
			// in autopilot mode, the motors are limited to "motorValue"*"scaleNumber"
			"thrust":{
				//used for autonomous mode
				"forward":{
					"leftMotor": motorValue,
					"rightMotor": motorValue,
					"liftMotor": 0
				},
				"backward":{
					"leftMotor": -motorValue,
					"rightMotor": -motorValue,
					"liftMotor": 0
				},
				"stop":{
					"leftMotor": 0,
					"rightMotor": 0,
					"liftMotor": 0
				},
				//used for web control mode
				// the fraction of the joystick movement * maxValue * scaleNumber gives the motor input.
				"minValue":0,
				"maxValue":1
			}
		},
		//timer for making decisions
		this.walkCounter = Date.now();


		//an object containing the values of the input data received from the arduino on the SignalFish.
		//this value was an array that stored old inputs, but it wasn't used and at a 100ms interval is
		// a waste of memory
		this.inputHistory = {
				"compass": 0,
				"altimeter": 0,
				"wifi": [],
				"wifiStrength": 0
		};
		_setDefaultInputObject.call(this);

		//the values to be sent to the SignalFish at the next cycle
		this.outputInstructions = {
			"enabled":false,
			"leftMotor":0,
			"rightMotor":0,
			"liftMotor": 0,
			"led":0,
			"readWifi":0,
			"setAltimter":0,
			"newHeading":-1
		};
		_setDefaultInstructions.call(this);
	}

	/*
		Sets the input object to the base state.
	*/
	function _setDefaultInputObject(){
		this.inputHistory.compass = 0;
		this.inputHistory.altimeter = 0;
		this.inputHistory.wifi = [];
		this.inputHistory.wifiStrength = 0;
	}

	/*
		Sets the output object to the base state.
	*/
	function _setDefaultInstructions(){
		this.outputInstructions.enabled = this.settings.started;
		this.outputInstructions.leftMotor = 0;
		this.outputInstructions.rightMotor = 0;
		this.outputInstructions.liftMotor = 0;
		this.outputInstructions.led = 0;
		this.outputInstructions.readWifi = 0;
		this.outputInstructions.setAltimter = 0;
		this.outputInstructions.newHeading = -1;
	}

	/*
		To prevent being broken by interestingly named SSIDs,
		each SSID is joined with its RSSI by a '$' character
		e.g. MyWifiName$75
		this wifi value is then joined to others by '?' characters.
		e.g. MyWifiName$75?MyOtherWifi$25?MyThirdWifi$50

		This function splits the generated wifi string from the arduino and
		creates 
		a) an array of values, 
		b) an average RSSI value

		TODO: make this more interesting.
		score wifi based on average, max, min, median, mode, whatever, 
		but something better than the average!!!
	*/
	function _parseWifi(wifi,outerDelim,innerDelim){
		var out = wifi.split(outerDelim);
		var len = out.length;
		var count = len;
		var totalStrength = 0;
		var strength = 0;
		for(var i = 0; i < len ; ++i){
			out[i] = out[i].split(innerDelim);
			strength = parseInt(out[i][1]);
			out[i][1] = strength;
			if(out[i][0] != "" && !isNaN(strength)){
				totalStrength += out[i][1];
			}else{
				count--;
			}
		}
		var averageStrength = round(totalStrength/count);

		return [out,averageStrength];
	}


	/*
	Generates the csv format data that is sent to the signalfish
	*/
	function _generateSerialFormatOutput(data){
		//create an array that will be joined and add the
		//values in the right order
		var arr = [];
		arr[0] = (data.enabled ? "1" : "0" );
		arr[1] = round(this.scaleNumber*data.leftMotor);
		arr[2] = round(this.scaleNumber*data.rightMotor);
		arr[3] = round(this.scaleNumber*data.liftMotor);
		arr[4] = data.led;
		arr[5] = data.setAltimter;
		arr[6] = data.readWifi;
		arr[7] = data.newHeading;

		var stringVersion = arr.join(",")+"\n";
		return stringVersion;
	}

	/*
	Decides what inputs to send to the server
	*/
	function _generateInstructions(data){
		//local references to some values to make the code shorter
		var instructions = this.outputInstructions;
		var thrustVals = this.settings.thrust;
		var compass = data.compass;
		var altimeter = data.altimeter;
		var wifi = data.wifi;
		var wifiStrength = data.wifiStrength;

		//if blimp has been started and no web controls active
		if(this.settings.webOverride === false && this.settings.started){
		//	console.log("if blimp has been started and no web controls active");
			//set default values of the output instructions
			_setDefaultInstructions.call(this);

			// tell the blimp to update the required altimeter value
			// the value is only on for one 100ms interval
			if(this.settings.setAltimeter){
				instructions.setAltimter = 1;
				this.settings.setAltimter = 0;
			}

			//wait [walkThreshold] before deciding to turn or go forward
			//this will be triggered every 5 seconds
			if(Date.now() > this.walkCounter + this.settings.walkThreshold || this.settings.activeWalk > 0){
				//if we're in the middle of a walk, go forward
				if(this.settings.activeWalk > 0){
					instructions.leftMotor = thrustVals.forward.leftMotor;
					instructions.rightMotor = thrustVals.forward.rightMotor;
					this.settings.activeWalk--;
				// otherwise 
				}else{	
					//update the walk counter
					this.walkCounter = Date.now();
					var rand = random();
					//randomly choose between walking, turning and reading wifi signal
					//25% chance of each
					if(rand > 0.75){ //25% chance of going forward
						// walk for a random period between longestWalkPeriod and minWalkPeriod;
						this.settings.activeWalk = this.settings.minWalkPeriod + round(random() * (this.settings.longestWalkPeriod - this.settings.minWalkPeriod));
						instructions.leftMotor = thrustVals.forward.leftMotor;
						instructions.rightMotor = thrustVals.forward.rightMotor;
					}else if (rand > 0.50){ //25% chance of turning left
						instructions.newHeading = ((compass - 15) + 360)%360; //normalize degree value to between 0 and 360
					}else if (rand > 0.25){ //25% chance of turning right
						instructions.newHeading = ((compass + 15) + 360)%360; //normalize degree value to between 0 and 360
					}else{//25% chance of checking wifi
						instructions.readWifi = 1;
					}
				}

				
			}
			//if the wifi strength is good enough, show the happy wifi light show
			//SignalFish Sketch will decide what the correct light sequence is based on the number.
			instructions.led = wifiStrength > 55 ? 2 : 1;//round(wifiStrength/5); 			

		// if web controls active or in stopped mode (settings.started == false)
		}else{
		//	console.log("web controls active or in stopped mode (settings.started == false)");
		}
	}

	// handler for the serial data event
	// generates instructions based on inputs from the Signalfish
	SignalFish.prototype.readInput = function(input){
		//the separators for values from the signalfish are characters
		//that are forbidden from use in an SSID, this way we won't accidentally
		//split the string in the middle of an SSID
		//the separators used are "]", "?" and "$"
		// ? and $ are used for wifi, the individual sensor readings are joined with "]"
		var output, sep = "]";
		//console.log(input);

		//no separators, input is not of the desired format
		if(input.indexOf(sep) == -1){
			// Not sure what else to do here...
			output = _generateSerialFormatOutput.call(this,this.outputInstructions);
		}else{
			//split the input based on sep into an array
			var splitInput = input.split(sep);
			// local reference for shorter code
			var data = this.inputHistory;
			//1st value from SF is the REQUIRED compass heading
			data.compass = splitInput[0];
			//2nd value from SF is the REQUIRED altitude
			data.altimeter = splitInput[1];
			//3rd value is the wifi
			//this value is none whenever the wifi isn't being read
			//so that we aren't needlessly sending the same data over and over
			//since the server already has this data
			if(splitInput[2] != "NONE"){
			//if the wifi is not NONE, we have a new value, we can parse it and overwrite the old one
			//otherwise the old values are preserved as there is no call to _setDefaultInputObject
				var wifi = _parseWifi.call(this,splitInput[2],"?","$");
				data.wifi = wifi[0];
				data.wifiStrength = wifi[1];
			};
			//decision making time
			_generateInstructions.call(this,data);
			// format the data to be written to serial
		 	output = _generateSerialFormatOutput.call(this,this.outputInstructions);//
		}
		return output;
	}

	//generates an output object, used for debugging and if
	//bad data is received from the SignalFish
	SignalFish.prototype.getOutput = function(){
		var output = _generateSerialFormatOutput.call(this,this.outputInstructions);
		return output;
	}

	//handler for the /api/set/height endpoint
	//one shot toggle.
	//web user clicks the set height button
	//endpoint is called
	//setAltimeter is set to 1
	//next time _generateInstructions is called, it reacts 
	//because setAltimeter is 1, and then sets it back to 0
	SignalFish.prototype.setHeight = function(){
		this.settings.setAltimter = 1;
	}

	//handler for the /api/start and /api/stop endpoints
	//toggles the autonomous mode in the SignalFish
	SignalFish.prototype.setStart = function(start){
		if(start === true){
			this.settings.started = true;
			this.outputInstructions.enabled = true;
		}else{
			_setDefaultInstructions.call(this);
			this.settings.started = false;
			this.outputInstructions.enabled = false;
		}
	}

	//when a web user is controlling the blimp, the webOverride flag is true
	SignalFish.prototype.setOverride = function(override){
		if(override === true){
			this.settings.webOverride = true;
		}else{
			this.settings.webOverride = false;
		}
	}


	// handler for the /api/data endpoint
	SignalFish.prototype.getData = function(){
		var data = {};
		data.output = this.outputInstructions;
		data.settings = this.settings;
		data.inputs = this.inputHistory[this.inputHistory.length -1];
		return data;
	}

	// handler for the /api/lift endpoint
	SignalFish.prototype.addLift = function(lift){
		if(this.settings.webOverride == true){
			lift = _normalizeValue.call(this,lift);
			this.outputInstructions.liftMotor = this.settings.thrust.maxValue * lift;
		}
	}

	// handler for the /api/thrust/ endpoint
	// this function handles forwards, backwards and turning
	SignalFish.prototype.addThrust = function(xThrust,yThrust){
		if(this.settings.webOverride == true){
			xThrust = _normalizeValue.call(this,xThrust);
			yThrust = _normalizeValue.call(this,yThrust);
			var left = 0;
			var right = 0;

			//	xThust != 0 indicates turn control
			if(xThrust != 0){
				left = -this.settings.thrust.maxValue * xThrust;
				right = -left;
			}else{
				left = this.settings.thrust.maxValue * yThrust;
				right = left;
			}


			this.outputInstructions.leftMotor = left;
			this.outputInstructions.rightMotor = right;
		}
	}

	//used to make sure values received from API are within acceptable limits
	function _normalizeValue(val){
		var value = val > 1 ? 1 : val;
		value = value < -1 ? -1 : value;
		return value;
	}

	module.exports = SignalFish;
})();