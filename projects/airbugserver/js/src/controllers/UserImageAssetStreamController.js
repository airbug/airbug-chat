/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.UserImageAssetStreamController')
//@Autoload

//@Require('Class')
//@Require('LiteralUtil')
//@Require('airbugserver.EntityController')
//@Require('bugcontroller.ControllerTag')
//@Require('bugioc.ArgTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var LiteralUtil         = bugpack.require('LiteralUtil');
    var EntityController    = bugpack.require('airbugserver.EntityController');
    var ControllerTag       = bugpack.require('bugcontroller.ControllerTag');
    var ArgTag              = bugpack.require('bugioc.ArgTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                 = ArgTag.arg;
    var bugmeta             = BugMeta.context();
    var controller          = ControllerTag.controller;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EntityController}
     */
    var UserImageAssetStreamController = Class.extend(EntityController, {

        _name: "airbugserver.UserImageAssetStreamController",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {ExpressApp} expressApp
         * @param {BugCallRouter} bugCallRouter
         * @param {UserImageAssetStreamService} userImageAssetStreamService
         * @param {Marshaller} marshaller
         */
        _constructor: function(expressApp, bugCallRouter, userImageAssetStreamService, marshaller) {

            this._super(expressApp, bugCallRouter, marshaller);


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

    bugmeta.tag(UserImageAssetStreamController).with(
        controller("userImageAssetStreamController")
            .args([
                arg().ref("expressApp"),
                arg().ref("bugCallRouter"),
                arg().ref("userImageAssetStreamService"),
                arg().ref("marshaller")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.UserImageAssetStreamController', UserImageAssetStreamController);
});
