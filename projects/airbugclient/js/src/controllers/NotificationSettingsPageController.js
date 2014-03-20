//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('NotificationSettingsPageController')
//@Autoload

//@Require('Class')
//@Require('airbug.ApplicationController')
//@Require('airbug.NotificationSettingsPageContainer')
//@Require('bugmeta.BugMeta')
//@Require('carapace.ControllerAnnotation')
//@Require('carapace.RoutingRequest')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                               = bugpack.require('Class');
var ApplicationController               = bugpack.require('airbug.ApplicationController');
var NotificationSettingsPageContainer   = bugpack.require('airbug.NotificationSettingsPageContainer');
var BugMeta                             = bugpack.require('bugmeta.BugMeta');
var ControllerAnnotation                = bugpack.require('carapace.ControllerAnnotation');
var RoutingRequest                      = bugpack.require('carapace.RoutingRequest');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                             = BugMeta.context();
var controller                          = ControllerAnnotation.controller;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var NotificationSettingsPageController = Class.extend(ApplicationController, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------


        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {NotificationSettingsPageContainer}
         */
        this.notificationSettingsPageContainer      = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createController: function() {
        this._super();
        this.notificationSettingsPageContainer = new NotificationSettingsPageContainer();
        this.setContainerTop(this.notificationSettingsPageContainer);
    },

    /**
     * @override
     * @protected
     * @param {RoutingRequest} routingRequest
     */
    filterRouting: function(routingRequest) {
        this.requireLogin(routingRequest, function(throwable, currentUser) {
            if (!throwable) {
                routingRequest.accept();
            } else {
                routingRequest.reject(RoutingRequest.RejectReason.ERROR, {throwable: throwable});
            }
        });
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(NotificationSettingsPageController).with(
    controller().route("settings/notification")
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.NotificationSettingsPageController", NotificationSettingsPageController);
