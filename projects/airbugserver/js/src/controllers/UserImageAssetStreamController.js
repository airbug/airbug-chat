//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.UserImageAssetStreamController')
//@Autoload

//@Require('Class')
//@Require('LiteralUtil')
//@Require('airbugserver.EntityController')
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
var LiteralUtil         = bugpack.require('LiteralUtil');
var EntityController    = bugpack.require('airbugserver.EntityController');
var ArgAnnotation       = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation    = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta             = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                 = ArgAnnotation.arg;
var bugmeta             = BugMeta.context();
var module              = ModuleAnnotation.module;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserImageAssetStreamController = Class.extend(EntityController, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(controllerManager, expressApp, bugCallRouter, userImageAssetStreamService) {

        this._super(controllerManager, expressApp, bugCallRouter);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {UserImageAssetStreamService}
         */
        this.userImageAssetStreamService   = userImageAssetStreamService;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {UserImageAssetStreamService}
     */
    getUserImageAssetStreamService: function() {
        return this.userImageAssetStreamService;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    configureController: function(callback) {
        var _this                       = this;
        var expressApp                  = this.getExpressApp();
        var userImageAssetStreamService = this.getUserImageAssetStreamService();

        // REST API
        //-------------------------------------------------------------------------------

        expressApp.get('/api/v1/userimageassetstream/:id', function(request, response) {
            var requestContext      = request.requestContext;
            var entityId            = request.params.id;
            userImageAssetStreamService.retrieveUserImageAssetStream(requestContext, entityId, function(throwable, entity) {
                _this.processAjaxRetrieveResponse(response, throwable, entity);
            });
        });

        expressApp.post('/api/v1/userimageassetstream', function(request, response) {
            var requestContext      = request.requestContext;
            var entityData          = request.body;
            userImageAssetStreamService.createUserImageAssetStream(requestContext, entityData, function(throwable, entity) {
                _this.processAjaxCreateResponse(response, throwable, entity);
            });
        });

        expressApp.put('/api/v1/userimageassetstream/:id', function(request, response) {
            var requestContext  = request.requestContext;
            var entityId        = request.params.id;
            var updates         = request.body;
            userImageAssetStreamService.updateUserImageAssetStream(requestContext, entityId, updates, function(throwable, entity) {
                _this.processAjaxUpdateResponse(response, throwable, entity);
            });
        });

        expressApp.delete('/api/v1/userimageassetstream/:id', function(request, response) {
            var _this = this;
            var requestContext  = request.requestContext;
            var entityId        = request.params.id;
            userImageAssetStreamService.deleteUserImageAssetStream(requestContext, entityId, function(throwable) {
                _this.processAjaxDeleteResponse(response, throwable, entity);
            });
        });

        this.getBugCallRouter().addAll({

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             * @param {function(Throwable=)} callback
             */
            retrieveUserImageAssetStream: function(request, responder, callback) {
                console.log("UserImageAssetStreamController#retrieveUserImageAssetStream");
                var data                    = request.getData();
                var userImageAssetStreamId  = data.objectId;
                var requestContext          = request.requestContext;

                userImageAssetStreamService.retrieveUserImageAssetStream(requestContext, userImageAssetStreamId, function(throwable, userImageAssetStream) {
                    _this.processRetrieveResponse(responder, throwable, userImageAssetStream, callback);
                });
            }
        });
        callback();
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(UserImageAssetStreamController).with(
    module("userImageAssetStreamController")
        .args([
            arg().ref("controllerManager"),
            arg().ref("expressApp"),
            arg().ref("bugCallRouter"),
            arg().ref("userImageAssetStreamService")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UserImageAssetStreamController', UserImageAssetStreamController);
