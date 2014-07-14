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

//@Export('airbug.ImageUploadModalContainer')

//@Require('Class')
//@Require('airbug.CommandModule')
//@Require('airbug.ImageUploadContainer')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.DivView')
//@Require('carapace.ModalView')
//@Require('carapace.TextView')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var CommandModule           = bugpack.require('airbug.CommandModule');
    var ImageUploadContainer    = bugpack.require('airbug.ImageUploadContainer');
    var AutowiredTag            = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag             = bugpack.require('bugioc.PropertyTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var CarapaceContainer       = bugpack.require('carapace.CarapaceContainer');
    var DivView                 = bugpack.require('carapace.DivView');
    var ModalView               = bugpack.require('carapace.ModalView');
    var TextView                = bugpack.require('carapace.TextView');
    var ViewBuilder             = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired               = AutowiredTag.autowired;
    var bugmeta                 = BugMeta.context();
    var CommandType             = CommandModule.CommandType;
    var property                = PropertyTag.property;
    var view                    = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CarapaceContainer}
     */
    var ImageUploadModalContainer = Class.extend(CarapaceContainer, {

        _name: "airbug.ImageUploadModalContainer",


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

            // Containers
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {ImageUploadContainer}
             */
            this.ImageUploadContainer       = null;


            // Modules
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {CommandModule}
             */
            this.commandModule              = null;

            /**
             * @private
             * @type {MessageHandlerModule}
             */
            this.messageHandlerModule       = null;


            // Views
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {ModalView}
             */
            this.modalView                  = null;

            /**
             * @private
             * @type {DivView}
             */
            this.wrapperView                = null;
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

            view(ModalView)
                .name("modalView")
                .children([
                    view(TextView)
                        .attributes({text: "Upload Image"})
                        .appendTo("#modal-header-{{cid}}"),
                    view(DivView)
                        .name("wrapperView")
                        .attributes({
                            classes: "image-upload-modal-wrapper"
                        })
                        .appendTo("#modal-body-{{cid}}")
                ])
                .build(this);

            // Wire Up
            //-------------------------------------------------------------------------------

            this.setViewTop(this.modalView);
        },

        /**
         * @protected
         */
        createContainerChildren: function() {
            this._super();
            this.imageUploadContainer = new ImageUploadContainer();
            this.addContainerChild(this.imageUploadContainer, "#div-" + this.wrapperView.getCid());
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();
            this.commandModule.unsubscribe(CommandType.DISPLAY.IMAGE_UPLOAD_MODAL, this.handleDisplayImageUploadModalCommand, this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.commandModule.subscribe(CommandType.DISPLAY.IMAGE_UPLOAD_MODAL, this.handleDisplayImageUploadModalCommand, this);
        },


        //-------------------------------------------------------------------------------
        // Message Handlers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {PublisherMessage} message
         */
        handleDisplayImageUploadModalCommand: function(message) {
            this.modalView.showModal();
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(ImageUploadModalContainer).with(
        autowired().properties([
            property("commandModule").ref("commandModule"),
            property("messageHandlerModule").ref("messageHandlerModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.ImageUploadModalContainer", ImageUploadModalContainer);
});
