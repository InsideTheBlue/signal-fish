define(function(require, exports, module) {
	var View    			= require("famous/core/View");
    var Surface            	= require("famous/core/Surface");
	var Modifier 			= require('famous/core/Modifier');
    var Draggable	 		= require('famous/modifiers/Draggable');
	var StateModifier 		= require('famous/modifiers/StateModifier');
    var loadURL				= require('famous/utilities/Utility').loadURL;
    var abs					= Math.abs;
    var round				= Math.round;


	function DraggableControl(props) {
		View.apply(this, arguments);

		var f = function(){};

		var DEFAULT_PROPS = {
			"radius" 	: 120,
			"useX" 		: 1,
			"useY" 		:  1,
			"label"		: "label",
			"onStart"	: f,
			"onEnd"	: f,
			"onUpdate"	: f
		}

		props 			= typeof(props) 		!= "undefined" ? props 			: DEFAULT_PROPS;
		this.radius 	= typeof(props.radius) 	!= "undefined" ? props.radius 	: DEFAULT_PROPS.radius;
		this.useX 		= typeof(props.useX) 	!= "undefined" ? props.useX 	: DEFAULT_PROPS.useX;
		this.useY 		= typeof(props.useY) 	!= "undefined" ? props.useY 	: DEFAULT_PROPS.useY;
		this.label 		= typeof(props.label) 	!= "undefined" ? props.label 	: DEFAULT_PROPS.label;
		this.onStart	= typeof(props.onStart) != "undefined" ? props.onStart 	: DEFAULT_PROPS.onStart;
		this.onEnd		= typeof(props.onEnd) 	!= "undefined" ? props.onEnd	: DEFAULT_PROPS.onEnd;
		this.onUpdate	= typeof(props.onUpdate)!= "undefined" ? props.onUpdate : DEFAULT_PROPS.onUpdate;

		_init.call(this);

	};
		
	DraggableControl.prototype = Object.create(View.prototype);
	DraggableControl.prototype.constructor = DraggableControl;

	function _init(){
		var radius 	= this.radius;
		var useX 	= this.useX;
		var useY 	= this.useY;
		var label 	= this.label;

    	var classes = ['blue-bg'];
    	(useX == 1 && useY == 1) ? classes.push('round') : null;

    	var size = [];
    	size[0] = useX === 1 ? radius*2 : radius*.125;
    	size[1] = useY === 1 ? radius*2 : radius*.125;


		var backgroundSurface = new Surface({
        	size: size,
        	classes: classes
    	});

		var draggableProps = {
        	snapX: 0, 
        	snapY: 0, 
        	xRange: [-radius*useX, radius*useX],
        	yRange: [-radius*useY, radius*useY]
    	}


    	var buttonSurfaceProps = {
	        size: [radius*.5, radius*.5],
	        content: label,
	        classes:  ["light-blue-bg","round"] ,
	        properties: {
	            lineHeight: (radius*.5)+'px',
	            textAlign: 'center',
	            cursor: 'pointer'
	        }
	    };

		this.draggable = new Draggable(draggableProps);

	    var buttonSurface = new Surface(buttonSurfaceProps);

	    this.draggable.subscribe(buttonSurface);

	    this.modifier = new Modifier({origin:[0.5,0.5]})

	    var node = this.add(this.modifier);
	    node.add(backgroundSurface);
	    node.add(this.draggable).add(buttonSurface);

	    
	    _addEvents.call(this);
	}

	DraggableControl.prototype.setAlign = function(align){
		this.modifier.setAlign(align);
	}

	function _addEvents(){
		var me = this;

	    this.draggable.on("start",function(obj){
	    	_startEvent.call(me,obj);
	    });

	    this.draggable.on("update",function(obj){
	    	_updateEvent.call(me,obj);
	    });

	    this.draggable.on("end",function(obj){
	    	_endEvent.call(me,obj);
	    });
	}

	function _startEvent(obj){
	//	console.log("start",obj.position);
		this.onStart("start",[_normalizeValue.call(this,obj.position[0]),-_normalizeValue.call(this,obj.position[1])]);
	}

	function _updateEvent(obj){
		var x = obj.position[0];
	    var y = obj.position[1];
    	// lock cursor to axes
    	var normalized = [];
    	if(abs(x) > abs(y)){
    		y = 0;
    		normalized[1] = 0;
    		normalized[0] = _normalizeValue.call(this,x);
    	}else{
    		x = 0;
    		normalized[0] = 0;
    		normalized[1] = -_normalizeValue.call(this,y);
    		//console.log(value,x,y,radius);
    		//loadURL("/api/lift/"+value);
    	}
    	this.draggable.setPosition([x,y]);

	    this.onUpdate("update",normalized);
	}

	function _endEvent(obj){
	//	console.log("end",obj.position);
		var xx = _normalizeValue.call(this,obj.position[0]);
		var yy = -_normalizeValue.call(this,obj.position[1]);
	    this.draggable.setPosition([0,0]);
	//    loadURL("/api/lift/0");
	//    loadURL("/api/end");
	    this.onEnd("end",[xx,yy]);
	}

	function _normalizeValue(val){
		var value = round((100*val)/this.radius)/100;
		value = abs(value) > 0.2 ? value : 0;
		return value;
	}
	

    module.exports = DraggableControl;
});