//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('PanelWithHeaderView')

//@Require('Class')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var MustacheView    = bugpack.require('airbug.MustacheView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var PanelWithHeaderView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div id="panel-wrapper-{{cid}}" class="panel-wrapper">' +
                    '<div id="panel-{{cid}}" class="panel {{classes}}">' +
                        '<div id="panel-header-{{cid}}" class="panel-header">' +
                            '<span id="panel-header-nav-left-{{cid}}" class="panel-header-nav-left"></span>' +
                            '<span class="panel-header-title text text-header">{{attributes.headerTitle}}</span>' +
                            '<span id="panel-header-nav-right-{{cid}}" class="panel-header-nav-right"></span>' +
                        '</div>' +
                        '<div id="panel-body-{{cid}}" class="panel-body">' +
                        '</div>' +
                    '</div>' +
                '</div>'
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.PanelWithHeaderView", PanelWithHeaderView);
