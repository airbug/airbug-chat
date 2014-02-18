//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('DialoguePageController')
//@Autoload

//@Require('Class')
//@Require('airbug.ApplicationController')
//@Require('airbug.DialoguePageContainer')
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
var ApplicationController       = bugpack.require('airbug.ApplicationController');
var DialoguePageContainer       = bugpack.require('airbug.DialoguePageContainer');
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

var DialoguePageController = Class.extend(ApplicationController, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
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

bugmeta.annotate(DialoguePageController).with(
    controller().route("dialogue/:id"),
    autowired().properties([
        property("dialogueManagerModule").ref("dialogueManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.DialoguePageController", DialoguePageController);
