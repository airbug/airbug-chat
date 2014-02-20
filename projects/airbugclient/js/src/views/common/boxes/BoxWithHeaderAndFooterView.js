//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('BoxWithHeaderAndFooterView')

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

var BoxWithHeaderAndFooterView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div id="box-{{cid}}" class="box box-with-header box-with-footer {{classes}}">' +
                    '<div id="box-header-{{cid}}" class="box-header">' +
                    '</div>' +
                    '<div id="box-body-{{cid}}" class="box-body">' +
                    '</div>' +
                    '<div id="box-footer-{{cid}}" class="box-footer">' +
                    '</div>' +
                '</div>'
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.BoxWithHeaderAndFooterView", BoxWithHeaderAndFooterView);
