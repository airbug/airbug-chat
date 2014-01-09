//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UserAssetController')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('LiteralUtil')
//@Require('airbugserver.EntityController')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Exception           = bugpack.require('Exception');
var LiteralUtil         = bugpack.require('LiteralUtil');
var EntityController    = bugpack.require('airbugserver.EntityController');
var BugFlow             = bugpack.require('bugflow.BugFlow');
var ArgAnnotation       = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation    = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta             = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                 = ArgAnnotation.arg;
var bugmeta             = BugMeta.context();
var module              = ModuleAnnotation.module;
var $series             = BugFlow.$series;
var $task               = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserAssetController = Class.extend(EntityController, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(controllerManager, expressApp, bugCallRouter, userAssetService) {

        this._super(controllerManager, expressApp, bugCallRouter, userAssetService);

        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AssetService}
         */
        this.userAssetService            = userAssetService;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {AssetService}
     */
    getUserAssetService: function() {
        return this.userAssetService;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    configureController: function(callback) {
        var _this               = this;
        //var expressApp          = this.getExpressApp();
        var userAssetService    = this.getUserAssetService();



        //-------------------------------------------------------------------------------
        // BugCall Routes
        //-------------------------------------------------------------------------------

        this.bugCallRouter.addAll({

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             * @param {function(Throwable)} callback
             */
            createUserAsset: function(request, responder, callback) {
                console.log("UserAssetController#createUserAsset");
                var data                = request.getData();
                var userAssetObject     = data.object;
                var requestContext      = request.requestContext;
                userAssetService.createUserAsset(requestContext, userAssetObject, function(throwable, userAsset) {
                    _this.processCreateResponse(responder, throwable, userAsset, callback);
                });
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             * @param {function(Throwable, UserAsset)} callback
             */
            renameUserAsset: function(request, responder, callback) {
                console.log("UserAssetController#createUserAsset");
                var data                = request.getData();
                var userAssetId         = data.userAssetId;
                var userAssetName       = data.userAssetName;
                var requestContext      = request.requestContext;
                userAssetService.renameUserAsset(requestContext, userAssetId, userAssetName, function(throwable, userAsset) {
                    // TODO - dkk - figure out how to respond
                    _this.processCreateResponse(responder, throwable, userAsset, callback);
                });

            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             * @param {function(Throwable)} callback
             */
            retrieveUserAsset: function(request, responder, callback) {
                console.log("UserController#retrieveUser");
                var data                = request.getData();
                var userAssetId         = data.objectId;
                var requestContext      = request.requestContext;
                console.log("data", data);
                console.log("userAssetId ", userAssetId);
                userAssetService.retrieveUser(requestContext, userAssetId, function(throwable, userAsset) {
                    _this.processRetrieveResponse(responder, throwable, userAsset, callback);
                });
            },

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             * @param {function(Throwable)} callback
             */
            retrieveUserAssets: function(request, responder, callback) {
                var data                = request.getData();
                var userAssetIds        = data.objectIds;
                var requestContext      = request.requestContext;
                userAssetService.retrieveUserAssets(requestContext, userAssetIds, function(throwable, userAssetMap) {
                    _this.processRetrieveEachResponse(responder, throwable, userAssetIds, userAssetMap, callback);
                });
            }
        });
        callback();
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(UserAssetController).with(
    module("userAssetController")
        .args([
            arg().ref("controllerManager"),
            arg().ref("expressApp"),
            arg().ref("bugCallRouter"),
            arg().ref("userAssetService")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UserAssetController', UserAssetController);
