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
//@Require('airbug.DivView')
//@Require('airbug.ImageUploadContainer')
//@Require('airbug.ModalView')
//@Require('airbug.TextView')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                                   = bugpack.require('Class');
    var CommandModule                           = bugpack.require('airbug.CommandModule');
    var DivView                                 = bugpack.require('airbug.DivView');
    var ImageUploadContainer                    = bugpack.require('airbug.ImageUploadContainer');
    var ModalView                               = bugpack.require('airbug.ModalView');
    var TextView                                = bugpack.require('airbug.TextView');
    var AutowiredAnnotation                     = bugpack.require('bugioc.AutowiredAnnotation');
    var PropertyAnnotation                      = bugpack.require('bugioc.PropertyAnnotation');
    var BugMeta                                 = bugpack.require('bugmeta.BugMeta');
    var CarapaceContainer                       = bugpack.require('carapace.CarapaceContainer');
    var ViewBuilder                             = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired                               = AutowiredAnnotation.autowired;
    var bugmeta                                 = BugMeta.context();
    var CommandType                             = CommandModule.CommandType;
    var property                                = PropertyAnnotation.property;
    var view                                    = ViewBuilder.view;


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

    bugmeta.annotate(ImageUploadModalContainer).with(
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
