//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugplugin.BridgeModule')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('TypeUtil')
//@Require('airbug.CurrentUser')
//@Require('airbug.CurrentUserManagerModule')
//@Require('airbug.CurrentUserModel')
//@Require('airbug.ManagerModule')
//@Require('bugcall.ResponseEvent')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.IInitializeModule')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                           = bugpack.require('Class');
    var Exception                       = bugpack.require('Exception');
    var TypeUtil                        = bugpack.require('TypeUtil');
    var CurrentUser                     = bugpack.require('airbug.CurrentUser');
    var CurrentUserManagerModule        = bugpack.require('airbug.CurrentUserManagerModule');
    var CurrentUserModel                = bugpack.require('airbug.CurrentUserModel');
    var ManagerModule                   = bugpack.require('airbug.ManagerModule');
    var ResponseEvent                   = bugpack.require('bugcall.ResponseEvent');
    var BugFlow                         = bugpack.require('bugflow.BugFlow');
    var ArgAnnotation                   = bugpack.require('bugioc.ArgAnnotation');
    var IInitializeModule               = bugpack.require('bugioc.IInitializeModule');
    var ModuleAnnotation                = bugpack.require('bugioc.ModuleAnnotation');
    var BugMeta                         = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                             = ArgAnnotation.arg;
    var bugmeta                         = BugMeta.context();
    var module                          = ModuleAnnotation.module;
    var $series                         = BugFlow.$series;
    var $task                           = BugFlow.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ManagerModule}
     */
    var BridgeModule = Class.extend(ManagerModule, {

        _name: "airbug.BridgeModule",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        _constructor: function(airbugApi, meldStore, meldBuilder, userManagerModule, navigationModule, bugCallRouter, logger, marshaller, currentUserManagerModule, bridge) {

            this._super(airbugApi, meldStore, meldBuilder);


            //-------------------------------------------------------------------------------
            // Declare Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Bridge}
             */
            this.bridge             = bridge;

            /**
             * @private
             * @type {BugCallRouter}
             */
            this.bugCallRouter      = bugCallRouter;

            /**
             * @private
             * @type {CurrentUser}
             */
            this.currentUser        = null;

            /**
             * @private
             * @type {null}
             */
            this.logger             = logger;

            /**
             * @private
             * @type {Marshaller}
             */
            this.marshaller         = marshaller;

            /**
             * @private
             * @type {NavigationModule}
             */
            this.navigationModule   = navigationModule;

            /**
             * @private
             * @type {UserManagerModule}
             */
            this.userManagerModule  = userManagerModule;

            /**
             * @private
             * @type {CurrentUserManagerModule}
             */
            this.currentUserManagerModule   = currentUserManagerModule;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {NavigationModule}
         */
        getNavigationModule: function() {
            return this.navigationModule;
        },


        //-------------------------------------------------------------------------------
        // IInitializeModule Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        deinitializeModule: function(callback) {
            callback();
        },

        /**
         * @param {function(Throwable=)} callback
         */
        initializeModule: function(callback) {
            var _this = this;
            var airbugApi = this.getAirbugApi();
            if (this.bridge) {
                this.bridge.registerMessageProcessor(this);
                this.bridge.ready = true;
            }

            callback();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Object=} messageObject
         * @param {function(Object=)} callback
         */
        processMessage: function(messageObject, callback) {
            console.log("BridgeModule processMessage()");

            if (messageObject.type === "LoginRequest") {
                var username = messageObject.data.username;
                var password = messageObject.data.password;
                var _this = this;
                this.currentUserManagerModule.loginUser(username, password, function(throwable) {
                    if (!throwable) {
                        var currentUserMeldDocument = _this.currentUserManagerModule.currentUser.meldDocument;
                        callback({
                            "type": "LoginSuccess",
                            "data": _this.marshaller.marshalData(currentUserMeldDocument)
                        });
                    } else {
                        callback({
                            "type": "LoginError",
                            "data": JSON.stringify(throwable)
                        });
                    }
                });
            } else {
                callback({
                            "type": "MessageError",
                            "data": "Unsupported message sent to BridgeModule"
                        });
            }
        },


        //-------------------------------------------------------------------------------
        // Api Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} message
         */
        displayNotification: function(message) {
            if (this.bridge) {
                this.bridge.sendMessage({
                    type: "UserNotification",
                    data: {
                        title: "Title",
                        subtitle: "Subtitle",
                        informativeText: "This is a test notification!"
                    }
                })
            } else {
                throw new Exception("NoBridgeFound", {}, "Could not find a bridge");
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(BridgeModule, IInitializeModule);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(BridgeModule).with(
        module("bridgeModule")
            .args([
                arg().ref("airbugApi"),
                arg().ref("meldStore"),
                arg().ref("meldBuilder"),
                arg().ref("userManagerModule"),
                arg().ref("navigationModule"),
                arg().ref("bugCallRouter"),
                arg().ref("logger"),
                arg().ref("marshaller"),
                arg().ref("currentUserManagerModule"),
                arg().value(window.bridge)
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.BridgeModule", BridgeModule);
});
