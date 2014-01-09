//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UserAssetService')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('Set')
//@Require('airbugserver.UserAsset')
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
var Obj                     = bugpack.require('Obj');
var Set                     = bugpack.require('Set');
var UserAsset               = bugpack.require('airbugserver.UserAsset');
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
var $parallel               = BugFlow.$parallel;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;
var $iterableParallel       = BugFlow.$iterableParallel;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserAssetService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    // TODO: wire this up in AirbugServerConfig
    _constructor: function(userAssetManager) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Logger}
         */
        this.logger                     = null;

        /**
         * @private
         * @type {UserAssetManager}
         */
        this.userAssetManager           = userAssetManager;
    },


    //-------------------------------------------------------------------------------
    // Service Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {RequestContext} requestContext
     * @param {UserAsset} userAssetObject
     * @param {Function(Throwable, UserAsset)} callback
     */
    createUserAsset: function(requestContext, userAssetObject, callback) {
        var userAssetManager = this.userAssetManager;
    },

    /**
     * @param {RequestContext} requestContext
     * @param {string} userAssetId
     * @param {string} userAssetName
     * @param {function(Throwable, UserAsset)} callback
     */
    renameUserAsset: function(requestContext, userAssetId, userAssetName, callback) {
        // retrieve user asset by user asset id
        // verify that the current user is the same as the user on the userasset
        // update the name
        // use the manager to save the user asset
    },

    /**
     * @param {RequestContext} requestContext
     * @param {string} userAssetId
     * @param {Function(Throwable, UserAsset)} callback
     */
    retrieveUserAsset: function(requestContext, userAssetId, callback) {

    },

    /**
     * @param {RequestContext} requestContext
     * @param {Array.<string>} userAssetIds
     * @param {function(Throwable, Map.<string, Room>)} callback
     */
    retrieveUserAssets: function(requestContext, userAssetIds, callback) {

    },

    /**
     * @param {RequestContext} requestContext
     * @param {string} userId
     * @param {function(Throwable, Map.<string, Room>)} callback
     */
    retrieveUserAssetsByUserId: function(requestContext, userId, callback) {

    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(UserAssetService).with(
    module("userAssetService")
        .args([
            arg().ref("userAssetManager")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UserAssetService', UserAssetService);
