//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('CodeEditorWidgetView')

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

var CodeEditorWidgetView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:
        '<div id="code-editor-widget-{{cid}}" class="code-editor-widget box {{classes}}">' +
            '<div id="code-editor-widget-header-{{cid}}" class="code-editor-workspace-header box-header">' +
            '</div>' +
            '<div id="code-editor-widget-body-{{cid}}" class="code-editor-widget-body box-body">' +
            '</div>' +
            '<div id="code-editor-widget-footer-{{cid}}" class="code-editor-widget-footer box-footer">' +
            '</div>' +
        '</div>'
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CodeEditorWidgetView", CodeEditorWidgetView);
