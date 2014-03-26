//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('AccountSettingsPageController')
//@Autoload

//@Require('Class')
//@Require('airbug.AccountSettingsPageContainer')
//@Require('airbug.ApplicationController')
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
var AccountSettingsPageContainer        = bugpack.require('airbug.AccountSettingsPageContainer');
var ApplicationController               = bugpack.require('airbug.ApplicationController');
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

var AccountSettingsPageController = Class.extend(ApplicationController, {

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
         * @type {AccountSettingsPageContainer}
         */
        this.accountSettingsPageContainer       = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createController: function() {
        this._super();
        this.accountSettingsPageContainer = new AccountSettingsPageContainer();
        this.setContainerTop(this.accountSettingsPageContainer);
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

bugmeta.annotate(AccountSettingsPageController).with(
    controller().route("settings/account")
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.AccountSettingsPageController", AccountSettingsPageController);