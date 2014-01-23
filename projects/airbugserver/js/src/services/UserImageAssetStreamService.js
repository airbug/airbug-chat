//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UserImageAssetStreamService')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('MappedThrowable')
//@Require('Obj')
//@Require('airbugserver.EntityService')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Exception               = bugpack.require('Exception');
var MappedThrowable         = bugpack.require('MappedThrowable');
var Obj                     = bugpack.require('Obj');
var EntityService           = bugpack.require('airbugserver.EntityService');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var ArgAnnotation           = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation        = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                     = ArgAnnotation.arg;
var bugmeta                 = BugMeta.context();
var module                  = ModuleAnnotation.module;
var $iterableParallel       = BugFlow.$iterableParallel;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {EntityService}
 */
var UserImageAssetStreamService = Class.extend(EntityService, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(userImageAssetStreamManager, userAssetManager, userImageAssetStreamPusher) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {UserImageAssetStreamManager}
         */
        this.userImageAssetStreamManager    = userImageAssetStreamManager;

        /**
         * @private
         * @type {UserImageAssetStreamPusher}
         */
        this.userImageAssetStreamPusher     = userImageAssetStreamPusher;

        /**
         * @private
         * @type {UserAssetManager}
         */
        this.userAssetManager               = userAssetManager;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {RequestContext} requestContext
     * @param {{
     *      conversationId: ObjectId
     * }} entityObject
     * @param {function(Throwable, ChatMessage=)} callback
     */
    createUserImageAssetStream: function(requestContext, entityObject, callback) {
        //TODO
        callback(new Exception("UnauthorizedAccess"));
    },

    /*
     * @param {RequestContext} requestContext
     * @param {string} entityId
     * @param {function(Throwable} callback
     */
    deleteUserImageAssetStream: function(requestContext, entityId, callback) {
        //TODO
        callback(new Exception("UnauthorizedAccess"));
    },

    /**
     * @param {RequestContext} requestContext
     * @param {string} entityId
     * @param {function(Throwable, UserImageAssetStream=)} callback
     */
    retrieveUserImageAssetStream: function(requestContext, entityId, callback) {
        var _this                   = this;
        var currentUser             = requestContext.get("currentUser");
        var callManager             = requestContext.get("callManager");
        var userImageAssetStream    = null;

        if (currentUser.isNotAnonymous() && currentUser.getId() === entityId) {
            $series([
                $task(function(flow) {
                    userImageAssetStream = _this.userImageAssetStreamManager.generateUserImageAssetStream({
                        id: entityId
                    });
                    _this.userImageAssetStreamPusher.meldCallWithUserImageAssetStream(callManager.getCallUuid(), userImageAssetStream, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.userImageAssetStreamPusher.pushUserImageAssetStreamToCall(userImageAssetStream, callManager.getCallUuid(), function(throwable) {
                        flow.complete(throwable);
                    })
                })
            ]).execute(function(throwable) {
                    if (!throwable) {
                        callback(null, userImageAssetStream);
                    } else {
                        callback(throwable);
                    }
                });
        } else {
            callback(new Exception("UnauthorizedAccess"));
        }
    },

    /*
     * @param {RequestContext} requestContext
     * @param {string} chatMessageId
     * @param {{*}} updates
     * @param {function(Throwable, ChatMessage} callback
     */
    updateUserImageAssetStream: function(requestContext, chatMessageId, updates, callback) {
        callback(new Exception("UnauthorizedAccess"));
    }


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(UserImageAssetStreamService).with(
    module("userImageAssetStreamService")
        .args([
            arg().ref("userImageAssetStreamManager"),
            arg().ref("userAssetManager"),
            arg().ref("userImageAssetStreamPusher")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UserImageAssetStreamService', UserImageAssetStreamService);
