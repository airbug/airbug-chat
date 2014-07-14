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

//@Export('airbug.ImageEditorWidgetContainer')

//@Require('Class')
//@Require('airbug.CommandModule')
//@Require('airbug.ImageEditorContainer')
//@Require('airbug.WorkspaceWidgetContainer')
//@Require('carapace.BoxView')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var CommandModule               = bugpack.require('airbug.CommandModule');
    var ImageEditorContainer        = bugpack.require('airbug.ImageEditorContainer');
    var WorkspaceWidgetContainer    = bugpack.require('airbug.WorkspaceWidgetContainer');
    var BoxView                     = bugpack.require('carapace.BoxView');
    var ViewBuilder                 = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var CommandType                 = CommandModule.CommandType;
    var view                        = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {WorkspaceWidgetContainer}
     */
    var ImageEditorWidgetContainer = Class.extend(WorkspaceWidgetContainer, {

        _name: "airbug.ImageEditorWidgetContainer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------


            // Views
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {BoxView}
             */
            this.boxView                    = null;


            // Containers
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {ImageEditorContainer}
             */
            this.imageEditorContainer       = null;
        },


        //-------------------------------------------------------------------------------
        // CarapaceContainer Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        createContainer: function() {
            this._super();


            // Create Views
            //-------------------------------------------------------------------------------

            view(BoxView)
                .name("boxView")
                .build(this);


            // Wire Up Views
            //-------------------------------------------------------------------------------

            this.setViewTop(this.boxView);
        },

        /**
         * @protected
         */
        createContainerChildren: function() {
            this._super();
            this.imageEditorContainer     = new ImageEditorContainer();
            this.addContainerChild(this.imageEditorContainer, "#box-body-" + this.boxView.getCid());
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.ImageEditorWidgetContainer", ImageEditorWidgetContainer);
});
