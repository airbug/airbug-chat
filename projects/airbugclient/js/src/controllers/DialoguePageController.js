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

//@Export('airbug.DialoguePageController')
//@Autoload

//@Require('Class')
//@Require('airbug.ApplicationController')
//@Require('airbug.DialoguePageContainer')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('carapace.ControllerTag')
//@Require('carapace.RoutingRequest')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var ApplicationController   = bugpack.require('airbug.ApplicationController');
    var DialoguePageContainer   = bugpack.require('airbug.DialoguePageContainer');
    var AutowiredTag            = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag             = bugpack.require('bugioc.PropertyTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var ControllerTag           = bugpack.require('carapace.ControllerTag');
    var RoutingRequest          = bugpack.require('carapace.RoutingRequest');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                 = BugMeta.context();
    var autowired               = AutowiredTag.autowired;
    var controller              = ControllerTag.controller;
    var property                = PropertyTag.property;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ApplicationController}
     */
    var DialoguePageController = Class.extend(ApplicationController, {

        _name: "airbug.DialoguePageController",


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

            /**
             * @private
             * @type {DialogueManagerModule}
             */
            this.dialogueManagerModule      = null;

            /**
             * @private
             * @type {DialoguePageContainer}
             */
            this.dialoguePageContainer      = null;
        },


        //-------------------------------------------------------------------------------
        // CarapaceController Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        createController: function() {
            this._super();
            this.dialoguePageContainer = new DialoguePageContainer();
            this.setContainerTop(this.dialoguePageContainer);
        },

        /**
         * @protected
         */
        destroyController: function() {
            this._super();
            this.dialoguePageContainer = null;
        },

        /**
         * @override
         * @protected
         * @param {RoutingRequest} routingRequest
         */
        filterRouting: function(routingRequest) {
            var _this = this;
            this.requireLogin(routingRequest, function(throwable, currentUser) {
                if (!throwable) {
                    var dialogueId      = routingRequest.getArgs()[0];
                    _this.dialogueManagerModule.retrieveDialogue(dialogueId, function(throwable, dialogue) {
                        if (!throwable) {
                            routingRequest.accept();
                        } else {
                            if (throwable.getType() === "NotFound") {
                                routingRequest.reject(RoutingRequest.RejectReason.NOT_FOUND);
                            } else {
                                routingRequest.reject(RoutingRequest.RejectReason.ERROR, {throwable: throwable});
                            }
                        }
                    });
                } else {
                    routingRequest.reject(RoutingRequest.RejectReason.ERROR, {throwable: throwable});
                }
            });
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(DialoguePageController).with(
        controller().route("dialogue/:id"),
        autowired().properties([
            property("dialogueManagerModule").ref("dialogueManagerModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.DialoguePageController", DialoguePageController);
});
