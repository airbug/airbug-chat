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
        '<div id="code-editor-widget-{{cid}}" class="code-editor-widget workspace-widget box {{classes}}">' +
            '<div id="code-editor-widget-header-{{cid}}" class="code-editor-widget-header workspace-widget-header box-header">' +
            '</div>' +
            '<div id="code-editor-widget-body-{{cid}}" class="code-editor-widget-body workspace-widget-body box-body">' +
            '</div>' +
            '<div id="code-editor-widget-footer-{{cid}}" class="code-editor-widget-footer workspace-widget-footer box-footer">' +
            '</div>' +
        '</div>'
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CodeEditorWidgetView", CodeEditorWidgetView);
