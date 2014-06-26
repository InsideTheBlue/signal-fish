define(function(require, exports, module) {
    var Engine             	= require("famous/core/Engine");
    var Surface            	= require("famous/core/Surface");
    var AppView 			= require('app/AppView');
	var FastClick 			= require('famous/inputs/FastClick');
	var FastClick 			= require('famous/inputs/MouseSync');

    //create the famous app
    var mainContext = Engine.createContext();
    var appView = new AppView(mainContext);

    //add a view
    mainContext.add(appView);
	mainContext.setPerspective(500);
});