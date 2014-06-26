define(function(require, exports, module) {
	var Flipper    			= require("famous/views/Flipper");
    var Surface            	= require("famous/core/Surface");
	var StateModifier 		= require('famous/modifiers/StateModifier');
	var ControlsView		= require('./ControlsView');
	var SensorsView		= require('./SensorsView');
	
	/*
	Custom version of the famo.us Flipper object
	containing the controls view and the sensors view
	*/
	function FlipperView(mainContext) {
		Flipper.apply(this, arguments);
		this.mainContext = mainContext;
		_addContent.call(this);
	};
	
	
		
	FlipperView.prototype = Object.create(Flipper.prototype);
	FlipperView.prototype.constructor = FlipperView;
	
	function _addContent(){
		//default view is the controls view
		this.frontView = new ControlsView(this.mainContext);

		this.backView = new SensorsView(this.mainContext);

		this.setFront(this.frontView);
		this.setBack(this.backView);
		
		this.toggle = false;
	}
	
	//flips the views about the y axis
	FlipperView.prototype.toggleView = function(){
		var angle = this.toggle ? 0 : Math.PI;
		this.setAngle(angle, {curve : 'easeOut', duration : 300});
		this.toggle = !this.toggle;
		this.backView.autoUpdate(this.toggle);
	};
	
	
    module.exports = FlipperView;
});