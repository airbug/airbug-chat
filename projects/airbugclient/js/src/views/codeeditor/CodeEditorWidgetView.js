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

var bugpack = require('bugpack').context();


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

    template:   '<div id="{{id}}" class="code-editor-widget box {{attributes.classes}}">' +
            '<div id="code-editor-widget-header" class="code-editor-workspace-header box-header">' +
            '</div>' +
            '<div id="code-editor-widget-body" class="code-editor-widget-body box-body">' +
            '</div>' +
            '<div id="code-editor-widget-footer" class="code-editor-widget-footer box-footer">' +
            '</div>' +
        '</div>',

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data    = this._super();
        data.id     = this.getId() || "code-editor-widget-" + this.getCid();
        return data;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CodeEditorWidgetView", CodeEditorWidgetView);
