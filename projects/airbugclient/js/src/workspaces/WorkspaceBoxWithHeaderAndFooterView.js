//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.WorkspaceBoxWithHeaderAndFooterView')

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

var WorkspaceBoxWithHeaderAndFooterView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div id="box-{{cid}}" class="workspace-widget box box-with-header box-with-footer {{classes}}">' +
        '<div id="box-header-{{cid}}" class="workspace-widget-header box-header">' +
        '</div>' +
        '<div id="box-body-{{cid}}" class="workspace-widget-body box-body">' +
        '</div>' +
        '<div id="box-footer-{{cid}}" class="workspace-widget-footer box-footer">' +
        '</div>' +
        '</div>'
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.WorkspaceBoxWithHeaderAndFooterView", WorkspaceBoxWithHeaderAndFooterView);
