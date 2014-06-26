define(function(require, exports, module) {
	var Engine             	= require("famous/core/Engine");
    var View            	= require('famous/core/View');
    var HeaderFooterLayout 	= require("famous/views/HeaderFooterLayout");
    var Surface            	= require("famous/core/Surface");
    var Modifier   			= require("famous/core/Modifier");
    var HeaderView			= require('./HeaderView');
	var FlipperView			= require('./FlipperView');

	//constructor
	function AppView(mainContext) {
		View.apply(this, arguments);
		this.mainContext = mainContext;

		_createMenuView.call(this);
		_createMainBody.call(this);

	};
	
	//boilerplatey stuff
	AppView.prototype = Object.create(View.prototype);
	AppView.prototype.constructor = AppView;
	
	//creates the header/footer layout but without a footer as we don't need one
	function _createMenuView(){

		//creates a custom header view instance
		var header = new HeaderView(this.mainContext);

		this.layout = new HeaderFooterLayout({
	        headerSize: header.headerHeight
	    });


		this.layout.header.add(header);

		//listen for an event from the header to trigger the flipper to swap views
		header.on(HeaderView.HEADER_TOGGLE_CLICKED , _toggleView.bind(this));
	
		this.add(this.layout);
	}
	
	// create a custom flipper instance to toggle between the controls view and the sensors log
	function _createMainBody(){
		var centerModifier = new Modifier({origin : [.5,.5]});
		this.flipper = new FlipperView(this.mainContext);
		this.layout.content.add(centerModifier).add(this.flipper);
	}

	//event listener function to toggle the flipper
	function _toggleView(){
		this.flipper.toggleView.call(this.flipper);
	}

	//more boilerplatey stuff
    module.exports = AppView;
});