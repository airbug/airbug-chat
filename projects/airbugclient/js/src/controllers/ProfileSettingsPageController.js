//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ProfileSettingsPageController')
//@Autoload

//@Require('Class')
//@Require('airbug.ApplicationController')
//@Require('airbug.ProfileSettingsPageContainer')
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
var ProfileSettingsPageContainer        = bugpack.require('airbug.ProfileSettingsPageContainer');
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

var ProfileSettingsPageController = Class.extend(ApplicationController, {

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
         * @type {ProfileSettingsPageContainer}
         */
        this.profileSettingsPageContainer       = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createController: function() {
        this._super();
        this.profileSettingsPageContainer = new ProfileSettingsPageContainer();
        this.setContainerTop(this.profileSettingsPageContainer);
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

bugmeta.annotate(ProfileSettingsPageController).with(
    controller().route("settings/profile")
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ProfileSettingsPageController", ProfileSettingsPageController);
