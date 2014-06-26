define(function(require, exports, module) {
	var Engine				= require("famous/core/Engine");
	var View    			= require("famous/core/View");
    var Surface            	= require("famous/core/Surface");
	var Modifier 			= require('famous/core/Modifier');
	var StateModifier 		= require('famous/modifiers/StateModifier');
    var loadURL				= require('famous/utilities/Utility').loadURL;
    var DraggableControl 	= require('./components/DraggableControl');
	
	
	function ControlsView(mainContext) {
		View.apply(this, arguments);
		this.mainContext = mainContext;
		_init.call(this);
	};


		
	ControlsView.prototype = Object.create(View.prototype);
	ControlsView.prototype.constructor = ControlsView;
	
	function _init(){
		this.background = new Surface({
        	size: [undefined, undefined],
        	content: "",
        	classes: ["white-bg"],
        	properties: {
            	lineHeight: window.innerHeight - 150 + 'px',
            	textAlign: "center"
        	}
    	});

    	this.add(this.background);

    	//a circular joystick to control rotation and forward/backward movement
    	this.thrust = new DraggableControl({"radius":100, "useX":1,"useY":1,"label":"Thrust","onStart":_onThrustEvent,"onEnd":_onThrustEvent,"onUpdate":_onThrustEvent});
    	//a linear slider to control lift
    	this.lift = new DraggableControl({"radius":100, "useX":0,"useY":1,"label":"Height","onStart":_onLiftEvent,"onEnd":_onLiftEvent,"onUpdate":_onLiftEvent});
    	this.add(this.thrust);
    	this.add(this.lift);

    	//adds a button to tell the SignalFish to set it's current altitude as the required one.
    	_addSetHeightButton.call(this);

    	Engine.on('resize', _onResize.bind(this));
    	setTimeout(_onResize.bind(this),100);
	}

	function _onResize(){
		var size = this.mainContext.getSize();
	//	this.background.setContent("size: "+ size[0] +" "+ size[1]);
		if(size[0] > size[1]){
			//landscape

    		this.thrust.setAlign([0.25,0.5]);
    		this.lift.setAlign([0.85,0.5]);
    		this.setHeightButtonModifier.setAlign([0.65,0.5]);
		}else{
			//portrait
			this.thrust.setAlign([0.35,0.35]);
			this.lift.setAlign([0.85,0.35])
    		this.setHeightButtonModifier.setAlign([0.85,0.75]);
		}
	}

	//event handler for thrust joystick
	function _onThrustEvent(type,values){
		console.log(type,values);
		switch(type){
			case("start"):
				loadURL("/api/input/start");
				loadURL("/api/thrust/"+values[0]+"/"+values[1]);
			break;
			case("update"):
				loadURL("/api/thrust/"+values[0]+"/"+values[1]);
			break;
			default:
				loadURL("/api/thrust/0/0");
	    		loadURL("/api/end");
		}
	}

	//event handler for lift slider
	function _onLiftEvent(type,values){
		console.log(type,values);
		switch(type){
			case("start"):
				loadURL("/api/input/start");
				loadURL("/api/lift/"+values[1]);
			break;
			case("update"):
				loadURL("/api/lift/"+values[1]);
			break;
			default:
				loadURL("/api/lift/0");
	    		loadURL("/api/input/end");

		}
	}

	function _addSetHeightButton(){
		var btnSize = 80;
	    this.setHeightButton = new Surface({
	    	size: [ btnSize, btnSize],
	    	content: "Set Height",
	    	classes: ["blue-bg"],
	    	properties:{
	    		lineHeight: btnSize + "px",
	    		textAlign: "center"
	    	}
	    });

	    this.setHeightButtonModifier = new StateModifier({
		    origin: [0.5,0.5]
		});

	    this.add(this.setHeightButtonModifier).add(this.setHeightButton);

	    this.setHeightButton.on("click", function() {
	    	loadURL("/api/set/height");
        });
	}
	
    module.exports = ControlsView;
});