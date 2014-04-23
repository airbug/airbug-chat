//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.GithubLoginPageController')
//@Autoload

//@Require('Class')
//@Require('airbug.ApplicationController')
//@Require('airbug.GithubLoginPageContainer')
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('carapace.ControllerAnnotation')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var ApplicationController       = bugpack.require('airbug.ApplicationController');
    var GithubLoginPageContainer    = bugpack.require('airbug.GithubLoginPageContainer');
    var BugMeta                     = bugpack.require('bugmeta.BugMeta');
    var AutowiredAnnotation         = bugpack.require('bugioc.AutowiredAnnotation');
    var PropertyAnnotation          = bugpack.require('bugioc.PropertyAnnotation');
    var ControllerAnnotation        = bugpack.require('carapace.ControllerAnnotation');


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
    var GithubLoginPageController = Class.extend(ApplicationController, {

        _name: "airbug.GithubLoginPageController",


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
             * @protected
             * @type {GithubLoginPageContainer}
             */
            this.githubLoginPageContainer = null;
        },


        //-------------------------------------------------------------------------------
        // CarapaceController Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        createController: function() {
            this._super();
            this.githubLoginPageContainer = new GithubLoginPageContainer();
            this.setContainerTop(this.githubLoginPageContainer);
        },

        /**
         * @protected
         */
        destroyController: function() {
            this._super();
            this.githubLoginPageContainer = null;
        },

        /**
         * @override
         * @protected
         * @param {RoutingRequest} routingRequest
         */
        filterRouting: function(routingRequest) {
            var _this = this;
            this.currentUserManagerModule.retrieveCurrentUser(function(throwable, currentUser) {
                if (!throwable) {
                    if (currentUser.isLoggedIn()) {
                        routingRequest.forward("home", {
                            trigger: true
                        });
                    } else {
                        routingRequest.accept();
                    }
                } else {
                    throw throwable;
                }
            });
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(GithubLoginPageController).with(
        controller().route("githubLogin")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.GithubLoginPageController", GithubLoginPageController);
});
