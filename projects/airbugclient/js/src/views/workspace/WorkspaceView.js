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

//@Export('airbug.WorkspaceView')

//@Require('Class')
//@Require('carapace.MustacheView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var MustacheView    = bugpack.require('carapace.MustacheView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MustacheView}
     */
    var WorkspaceView = Class.extend(MustacheView, {

        _name: "airbug.WorkspaceView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:
            '<div id="workspace-{{cid}}" class="workspace {{classes}}">' +
            '</div>'
    });



    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.WorkspaceView", WorkspaceView);
});
