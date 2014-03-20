//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('SettingsPageController')
//@Autoload

//@Require('Class')
//@Require('airbug.ApplicationController')
//@Require('bugmeta.BugMeta')
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
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var ControllerAnnotation        = bugpack.require('carapace.ControllerAnnotation');
var RoutingRequest              = bugpack.require('carapace.RoutingRequest');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                     = BugMeta.context();
var controller                  = ControllerAnnotation.controller;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SettingsPageController = Class.extend(ApplicationController, {

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
                routingRequest.forward("settings/profile", {
                    trigger: true
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

bugmeta.annotate(SettingsPageController).with(
    controller().route("settings")
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.SettingsPageController", SettingsPageController);
