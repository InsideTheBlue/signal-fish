define(function(require, exports, module) {
    var View            	= require('famous/core/View');
    var Surface            	= require("famous/core/Surface");
	var StateModifier 		= require('famous/modifiers/StateModifier');
    var loadURL				= require('famous/utilities/Utility').loadURL;

    const HEADER_HEIGHT = 60;

	function HeaderView(mainContext) {
		View.apply(this, arguments);
		this.mainContext = mainContext;
		_init.call(this);
	};
		
	HeaderView.prototype = Object.create(View.prototype);
	HeaderView.prototype.constructor = HeaderView;

	HeaderView.HEADER_TOGGLE_CLICKED = "HEADER_TOGGLE_CLICKED";

	function _init(){

	    var background = new Surface({
	        size: [undefined, HEADER_HEIGHT],
	        content: "SignalFish",
	        classes: ["blue-bg"],
	        properties: {
	            lineHeight: HEADER_HEIGHT+"px",
	            textAlign: "center"
	        }
	    });

	    var btnSize = HEADER_HEIGHT - 10;
	    var switchViewButton = new Surface({
	    	size: [ btnSize, btnSize],
	    	content: "Log",
	    	classes: ["white-bg"],
	    	properties:{
	    		lineHeight: btnSize + "px",
	    		textAlign: "center"
	    	}
	    });

	    // button that starts and stops the autonomous mode
	    var startButton = new Surface({
	    	size: [ btnSize, btnSize],
	    	content: "Start",
	    	classes: ["white-bg"],
	    	properties:{
	    		lineHeight: btnSize + "px",
	    		textAlign: "center"
	    	}
	    });

	    var startButtonModifier = new StateModifier({
		    origin: [0,0.5],
		    align: [0.01,0.5]
		  });

	    this.add(background);
	    this.add(startButtonModifier).add(startButton);

	    startButton.on("click", function() {
	    	if(startButton.getContent() === "Start"){
	    		loadURL("/api/start/");
	    		startButton.setContent("Stop");
	    	}else{
	    		startButton.setContent("Start");
	    		loadURL("/api/stop/");
	    	}
        }.bind(this));
	    /*
		// This is the button to toggle the FlipperView 
		// between ControlsView and SensorView.
		// The SensorView isn't ready yet so we won't display the button
	    var switchViewButtonModifier = new StateModifier({
		    origin: [1,0.5],
		    align: [0.99,0.5]
		  });


	    this.add(switchViewButtonModifier).add(switchViewButton);
	    switchViewButton.on("click", function() {
            this._eventOutput.emit(HeaderView.HEADER_TOGGLE_CLICKED);
            if(switchViewButton.getContent() === "Ctrls"){
           		switchViewButton.setContent("Log");
            }else{
            	switchViewButton.setContent("Ctrls");
            }
        }.bind(this));
*/
	}

	HeaderView.prototype.headerHeight = HEADER_HEIGHT;


    module.exports = HeaderView;
});