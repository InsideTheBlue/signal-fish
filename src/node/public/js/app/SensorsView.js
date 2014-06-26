define(function(require, exports, module) {
	var Engine				= require("famous/core/Engine");
	var View    			= require("famous/core/View");
    var Surface            	= require("famous/core/Surface");
	var Modifier 			= require('famous/core/Modifier');
	var Scrollview			= require('famous/views/Scrollview');
	var StateModifier 		= require('famous/modifiers/StateModifier');
    var loadURL				= require('famous/utilities/Utility').loadURL;
    var DraggableControl 	= require('./components/DraggableControl');
	
	
	function SensorsView(mainContext) {
		View.apply(this, arguments);
		this.mainContext = mainContext;
		_init.call(this);
	};


		
	SensorsView.prototype = Object.create(View.prototype);
	SensorsView.prototype.constructor = SensorsView;
	
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

    	this.scrollView = new Scrollview({direction:1});


    	Engine.on('resize', _onResize.bind(this));
    	setTimeout(_onResize.bind(this),100);
	}

	function _onResize(){
		var size = this.mainContext.getSize();
	//	this.background.setContent("size: "+ size[0] +" "+ size[1]);
		if(size[0] > size[1]){
			//landscape

		}else{
			//portrait
		}
	}

	SensorsView.prototype.autoUpdate = function(on) {
		// body...
		if(on){
			this.interval = setInterval(function(){ 
				loadURL("/api/data",function(out){
					var json = JSON.parse(out);
					console.log(json);
				});
        	}.bind(this),2000);
		}else{
			clearInterval(this.interval);
		}
	};

	function updateValues(){
	}
	
    module.exports = SensorsView;
});