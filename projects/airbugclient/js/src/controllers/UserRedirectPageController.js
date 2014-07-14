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

//@Export('airbug.UserRedirectPageController')
//@Autoload

//@Require('Class')
//@Require('Pair')
//@Require('airbug.ApplicationController')
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
    var Pair                    = bugpack.require('Pair');
    var ApplicationController   = bugpack.require('airbug.ApplicationController');
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
    var UserRedirectPageController = Class.extend(ApplicationController, {

        _name: "airbug.UserRedirectPageController",


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
        },


        //-------------------------------------------------------------------------------
        // CarapaceController Methods
        //-------------------------------------------------------------------------------

        /**
         * @override
         * @protected
         * @param {RoutingRequest} routingRequest
         */
        filterRouting: function(routingRequest) {
            var _this = this;
            this.requireLogin(routingRequest, function(throwable, currentUser) {
                if (!throwable) {
                    var userId      = routingRequest.getArgs()[0];
                    _this.dialogueManagerModule.retrieveDialogueByUserIdForCurrentUser(userId, function(throwable, dialogue) {
                        if (!throwable) {
                            routingRequest.forward("dialogue/" + dialogue.getData().id, {
                                trigger: true
                            });
                        } else {
                            if (throwable.getType() === "NotFound") {
                                _this.dialogueManagerModule.createDialogue({
                                    userIdPair: new Pair(currentUser.getId(), userId)
                                }, function(throwable, dialogue) {
                                    if (!throwable) {
                                        routingRequest.forward("dialogue/" + dialogue.getData().id, {
                                            trigger: true
                                        });
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

    bugmeta.tag(UserRedirectPageController).with(
        controller().route("user/:id"),
        autowired().properties([
            property("dialogueManagerModule").ref("dialogueManagerModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.UserRedirectPageController", UserRedirectPageController);
});
