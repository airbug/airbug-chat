//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('UserRedirectPageController')
//@Autoload

//@Require('Class')
//@Require('Pair')
//@Require('airbug.ApplicationController')
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('carapace.ControllerAnnotation')
//@Require('carapace.RoutingRequest')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Pair                        = bugpack.require('Pair');
var ApplicationController       = bugpack.require('airbug.ApplicationController');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var AutowiredAnnotation         = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation          = bugpack.require('bugioc.PropertyAnnotation');
var ControllerAnnotation        = bugpack.require('carapace.ControllerAnnotation');
var RoutingRequest              = bugpack.require('carapace.RoutingRequest');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                     = BugMeta.context();
var autowired                   = AutowiredAnnotation.autowired;
var controller                  = ControllerAnnotation.controller;
var property                    = PropertyAnnotation.property;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {ApplicationController}
 */
var UserRedirectPageController = Class.extend(ApplicationController, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

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

bugmeta.annotate(UserRedirectPageController).with(
    controller().route("user/:id"),
    autowired().properties([
        property("dialogueManagerModule").ref("dialogueManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.UserRedirectPageController", UserRedirectPageController);
