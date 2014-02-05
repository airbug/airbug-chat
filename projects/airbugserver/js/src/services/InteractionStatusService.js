//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('InteractionStatusService')
//@Autoload

//@Require('Class')
//@Require('DualMultiSetMap')
//@Require('Obj')
//@Require('Set')
//@Require('airbug.InteractionStatusDefines')
//@Require('airbug.UserDefines')
//@Require('airbugserver.RequestContext')
//@Require('bugcall.CallEvent')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.IInitializeModule')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var DualMultiSetMap             = bugpack.require('DualMultiSetMap');
var Obj                         = bugpack.require('Obj');
var InteractionStatusDefines    = bugpack.require('airbug.InteractionStatusDefines');
var UserDefines                 = bugpack.require('airbug.UserDefines');
var RequestContext              = bugpack.require('airbugserver.RequestContext');
var CallEvent                   = bugpack.require('bugcall.CallEvent');
var BugFlow                     = bugpack.require('bugflow.BugFlow');
var ArgAnnotation               = bugpack.require('bugioc.ArgAnnotation');
var IInitializeModule           = bugpack.require('bugioc.IInitializeModule');
var ModuleAnnotation            = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                     = ArgAnnotation.arg;
var bugmeta                 = BugMeta.context();
var module                  = ModuleAnnotation.module;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
var InteractionStatusService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {Logger} logger
     * @param {BugCallServer} bugCallServer
     * @param {InteractionStatusManager} interactionStatusManager
     * @param {UserManager} userManager
     * @param {UserPusher} userPusher
     */
    _constructor: function(logger, bugCallServer, interactionStatusManager, userManager, userPusher) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BugCallServer}
         */
        this.bugCallServer                  = bugCallServer;

        /**
         * @private
         * @type {InteractionStatusManager}
         */
        this.interactionStatusManager       = interactionStatusManager;

        /**
         * @private
         * @type {Logger}
         */
        this.logger                         = logger;

        /**
         * @private
         * @type {UserManager}
         */
        this.userManager                    = userManager;

        /**
         * @private
         * @type {UserPusher}
         */
        this.userPusher                     = userPusher;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {BugCallServer}
     */
    getBugCallServer: function() {
        return this.bugCallServer;
    },

    /**
     * @return {InteractionStatusManager}
     */
    getInteractionStatusManager: function() {
        return this.interactionStatusManager;
    },

    /**
     * @return {Logger}
     */
    getLogger: function() {
        return this.logger;
    },


    //-------------------------------------------------------------------------------
    // IInitializeModule Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    deinitializeModule: function(callback) {
        this.bugCallServer.off(CallEvent.CLOSED, this.hearCallClosed, this);
        callback();
    },

    /**
     * @param {function(Throwable=)} callback
     */
    initializeModule: function(callback) {
        this.bugCallServer.on(CallEvent.CLOSED, this.hearCallClosed, this);
        callback();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {RequestContext} requestContext
     * @param {string} interactionStatus
     * @param {function(Throwable=)} callback
     */
    setInteractionStatus: function(requestContext, interactionStatus, callback) {
        var _this               = this;
        var call                = requestContext.get("call");
        var currentUser         = requestContext.get("currentUser");
        $series([
            $task(function(flow) {
                _this.interactionStatusManager.setInteractionStatusForCallUuid(call.getCallUuid(), interactionStatus, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.recalculateUserStatus(currentUser, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                callback();
            } else {
                callback(throwable);
            }
        });
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {User} user
     * @param {function(Throwable=)} callback
     */
    recalculateUserStatus: function(user, callback) {
        var _this           = this;
        var hasStatus       = false;
        var statusChanged   = false;
        var userStatus      = null;
        $series([
            $task(function(flow) {
                _this.interactionStatusManager.doesUserHaveInteractionStatus(user.getId(), function(throwable, returnedHasStatus) {
                    if (!throwable) {
                        hasStatus = returnedHasStatus;
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                if (hasStatus) {
                    _this.interactionStatusManager.getAllInteractionStatusesForUserId(user.getId(), function(throwable, statuses) {
                        if (!throwable) {
                            if (statuses.indexOf(InteractionStatusDefines.Status.ACTIVE) > -1) {
                                userStatus = UserDefines.Status.ACTIVE;
                            } else {
                                userStatus = UserDefines.Status.HEADSDOWN;
                            }
                            flow.complete();
                        } else {
                            flow.error(throwable);
                        }
                    });
                } else {
                    userStatus = UserDefines.Status.OFFLINE;
                    flow.complete();
                }
            }),
            $task(function(flow) {
                if (user.getStatus() !== userStatus) {
                    statusChanged = true;
                }
                if (statusChanged) {
                    user.setStatus(userStatus);
                    _this.userManager.updateUser(user, function(throwable) {
                        flow.complete(throwable);
                    });
                } else {
                    flow.complete();
                }
            }),
            $task(function(flow) {
                if (statusChanged) {
                    _this.userPusher.pushUser(user, function(throwable) {
                        flow.complete(throwable);
                    });
                } else {
                    flow.complete();
                }
            })
        ]).execute(callback);
    },

    /**
     * @private
     * @param {string} callUuid
     */
    removeInteractionStatusForCallUuid: function(callUuid) {
        var _this = this;
        this.interactionStatusManager.removeInteractionStatusForCallUuid(callUuid, function(throwable) {
            if (throwable) {
                _this.logger.error(throwable);
            }
        });
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {CallEvent} event
     */
    hearCallClosed: function(event) {
        var data            = event.getData();
        var call            = data.call;
        this.removeInteractionStatusForCallUuid(call.getCallUuid());
    }
});


//-------------------------------------------------------------------------------
// Implement Interfaces
//-------------------------------------------------------------------------------

Class.implement(InteractionStatusService, IInitializeModule);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(InteractionStatusService).with(
    module("interactionStatusService")
        .args([
            arg().ref("logger"),
            arg().ref("bugCallServer"),
            arg().ref("interactionStatusManager"),
            arg().ref("userManager"),
            arg().ref("userPusher")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.InteractionStatusService', InteractionStatusService);
