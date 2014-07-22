(function(){
/* //////////////////////////////////////////////////////
SIGNAL FISH PORTION
*/ //////////////////////////////////////////////////////

//import and create a SignalFish
var SignalFish = require('./SignalFish');
var signalFish = new SignalFish();

//import node serialport
var serialportLib = require("serialport");
var SerialPort = serialportLib.SerialPort;


/*
Set to the correct address for the galileo serial port
*/
//galileo serial port
var serialAddress = "/dev/ttyS0";
//var serialAddress = "/dev/cu.usbserial-AD02FND5";

//create the serialport object
var serial = new SerialPort(serialAddress, {
	//set the baudrate to whatever your xbees are set at.
	//in our case, 38400
	baudrate: 38400,
	//by default serialport uses the rawPacket parser
	//change this to the readline parser since we
	//terminate each transmission with a newline character.
	parser: serialportLib.parsers.readline("\n")
});

//add the open event listener
serial.on("open", onSerialOpen);

// function called when the serial port is ready
function onSerialOpen(){
//	console.log('open');
	//every 100ms write some data to the serial port
	setInterval(sendSignalFishData,100);
	//add the event listener for when the serial
	//port receives data
	serial.on('data', onSerialData);
}

// function called when serial data is received
function onSerialData(data){
//	console.log("Data Received",data);
	signalFish.readInput(data);
}

// function called on the interval
function sendSignalFishData(){
	/*//test code
	signalFish.readInput("320]1920.92]MyWifi$60?YourWifi$50");
	*/
	// asks the signalFish to generate output instructions
	var instructions = signalFish.getOutput();
	//write the instructions to serial
	serial.write(instructions,function(err,results){});
	console.log("Sending: ",instructions);
}

/* //////////////////////////////////////////////////////
API PORTION
*/ //////////////////////////////////////////////////////

//this will handle all the api calls
var ApiHandler = require('./ApiHandler');
//pass in the signalFish object so that the api can
//route the requests correctly
var apiHandler = new ApiHandler(signalFish);


// require express and create the app
// express gives us all the basic http server functionality
// in a nicely built package
var express = require('express');
var app = express();

// create a router for the API to keep api routing self contained
var apiRouter = express.Router();

// configure the index html file to be served when 
// accessing the website root.
var indexPath = './public/html/index.html';

//when a request to the app root comes
//return the base index file.
app.get('/',function(req,res){
    res.sendfile(indexPath);
});

// configure the api get route for the base api level
// i.e. /api/ (the API router will be used only
// for anything with /api at the beginning)
apiRouter.get('/*',function(req,res){
	//res.json({'message':'hello api'});
	apiHandler.handleRequest(req,res);
});


// the apiRouter object will only apply to /api/ urls
app.use('/api',apiRouter);


// add the static content which is in the /public dir
// this magic saves us having to manually serve calls to
// all our html, js, and css files
app.use(express.static(__dirname + '/public'));

// finally, start serving on port 8080, or whatever port you see fit
var server = app.listen(8080,function(){
	console.log('Listening on port %d', server.address().port);
});


})();
