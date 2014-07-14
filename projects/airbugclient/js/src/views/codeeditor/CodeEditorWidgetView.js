/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.CodeEditorWidgetView')

//@Require('Class')
//@Require('carapace.BoxView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var BoxView     = bugpack.require('carapace.BoxView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {BoxView}
     */
    var CodeEditorWidgetView = Class.extend(BoxView, {

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
});
