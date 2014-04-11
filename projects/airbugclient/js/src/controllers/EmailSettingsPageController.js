//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.EmailSettingsPageController')
//@Autoload

//@Require('Class')
//@Require('airbug.ApplicationController')
//@Require('airbug.EmailSettingsPageContainer')
//@Require('bugmeta.BugMeta')
//@Require('carapace.ControllerAnnotation')
//@Require('carapace.RoutingRequest')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                               = bugpack.require('Class');
    var ApplicationController               = bugpack.require('airbug.ApplicationController');
    var EmailSettingsPageContainer          = bugpack.require('airbug.EmailSettingsPageContainer');
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

    /**
     * @class
     * @extends {ApplicationController}
     */
    var EmailSettingsPageController = Class.extend(ApplicationController, {

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
             * @type {EmailSettingsPageContainer}
             */
            this.emailSettingsPageContainer     = null;
        },


        //-------------------------------------------------------------------------------
        // CarapaceController Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        createController: function() {
            this._super();
            this.emailSettingsPageContainer = new EmailSettingsPageContainer();
            this.setContainerTop(this.emailSettingsPageContainer);
        },

        /**
         * @protected
         */
        destroyController: function() {
            this._super();
            this.emailSettingsPageContainer = null;
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

    bugmeta.annotate(EmailSettingsPageController).with(
        controller().route("settings/email")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.EmailSettingsPageController", EmailSettingsPageController);
});
