//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.WorkspaceBoxWithHeaderView')

//@Require('Class')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var MustacheView    = bugpack.require('airbug.MustacheView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MustacheView}
     */
    var WorkspaceBoxWithHeaderView = Class.extend(MustacheView, {

        _name: "airbug.WorkspaceBoxWithHeaderView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:   '<div id="box-{{cid}}" class="workspace-widget box box-with-header {{classes}}">' +
                '<div id="box-header-{{cid}}" class="workspace-widget-header box-header">' +
                '</div>' +
                '<div id="box-body-{{cid}}" class="workspace-widget-body box-body">' +
                '</div>' +
            '</div>'
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.WorkspaceBoxWithHeaderView", WorkspaceBoxWithHeaderView);
});
