//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ApplicationHeaderView')

//@Require('Class')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var MustacheView    = bugpack.require('airbug.MustacheView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ApplicationHeaderView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div id="application-header-wrapper" class="navbar navbar-fixed-top">' +
                    '<div class="container">' +
                        '<div class="header">' +
                            '<div id="header-left">' +
                            '</div>' +
                            '<div id="header-center">' +
                                '<div id="logo" class="brand" align="center">' +
                                    '<img id="logo-image" src="img/airbug-small.png"/>' +
                                '</div>' +
                            '</div>' +
                            '<div id="header-right">' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>'
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ApplicationHeaderView", ApplicationHeaderView);
