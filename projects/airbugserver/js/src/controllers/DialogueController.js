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

//@Export('airbugserver.DialogueController')
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
    var DialogueController = Class.extend(EntityController, {

        _name: "airbugserver.DialogueController",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {ExpressApp} expressApp
         * @param {BugCallRouter} bugCallRouter
         * @param {DialogueService} dialogueService
         * @param {Marshaller} marshaller
         */
        _constructor: function(expressApp, bugCallRouter, dialogueService, marshaller) {

            this._super(expressApp, bugCallRouter, marshaller);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {DialogueService}
             */
            this.dialogueService                = dialogueService;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {DialogueService}
         */
        getDialogueService: function() {
            return this.dialogueService;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        configureController: function(callback) {
            var _this               = this;
            var expressApp          = this.getExpressApp();
            var dialogueService     = this.getDialogueService();

            // REST API
            //-------------------------------------------------------------------------------

            expressApp.get('/api/v1/dialogue/:id', function(request, response){
                var requestContext  = request.requestContext;
                var dialogueId      = request.params.id;
                dialogueService.retrieveDialogue(requestContext, dialogueId, function(throwable, entity){
                    _this.processAjaxRetrieveResponse(response, throwable, entity);
                });
            });

            expressApp.post('/api/v1/dialogue', function(request, response){
                var requestContext  = request.requestContext;
                var dialogue        = request.body;
                dialogueService.createDialogue(requestContext, dialogue, function(throwable, entity){
                    _this.processAjaxCreateResponse(response, throwable, entity);
                });
            });

            expressApp.put('/api/v1/dialogue/:id', function(request, response){
                var requestContext  = request.requestContext;
                var dialogueId      = request.params.id;
                var updates         = request.body;
                dialogueService.updateDialogue(requestContext, dialogueId, updates, function(throwable, entity){
                    _this.processAjaxUpdateResponse(response, throwable, entity);sponse.json(dialogueJson);
                });
            });

            expressApp.delete('/api/v1/dialogue/:id', function(request, response){
                var _this           = this;
                var requestContext  = request.requestContext;
                var dialogueId      = request.params.id;
                dialogueService.deleteDialogue(requestContext, dialogueId, function(throwable){
                    _this.processAjaxDeleteResponse(response, throwable, entity);
                });
            });

            this.bugCallRouter.addAll({

                /**
                 * @param {IncomingRequest} request
                 * @param {CallResponder} responder
                 * @param {function(Throwable=)} callback
                 */
                createDialogue:     function(request, responder, callback) {
                    var data                = request.getData();
                    var dialogueData        = data.object;
                    var requestContext      = request.requestContext;

                    dialogueService.createDialogue(requestContext, dialogueData, function(throwable, dialogue) {
                        _this.processCreateResponse(responder, throwable, dialogue, callback);
                    });
                },

                /**
                 * @param {IncomingRequest} request
                 * @param {CallResponder} responder
                 * @param {function(Throwable=)} callback
                 */
                retrieveDialogue:   function(request, responder, callback) {
                    var data                = request.getData();
                    var dialogueId          = data.objectId;
                    var requestContext      = request.requestContext;

                    dialogueService.retrieveDialogue(requestContext, dialogueId, function(throwable, dialogue) {
                        _this.processRetrieveResponse(responder, throwable, dialogue, callback);
                    });
                },

                /**
                 * @param {IncomingRequest} request
                 * @param {CallResponder} responder
                 * @param {function(Throwable=)} callback
                 */
                retrieveDialogueByUserIdForCurrentUser:   function(request, responder, callback) {
                    var data                = request.getData();
                    var userId              = data.userId;
                    var requestContext      = request.requestContext;

                    dialogueService.retrieveDialogueByUserIdForCurrentUser(requestContext, userId, function(throwable, dialogue) {
                        _this.processRetrieveResponse(responder, throwable, dialogue, callback);
                    });
                },

                /**
                 * @param {IncomingRequest} request
                 * @param {CallResponder} responder
                 * @param {function(Throwable=)} callback
                 */
                retrieveDialogues: function(request, responder, callback) {
                    var data                = request.getData();
                    var dialogueIds         = data.objectIds;
                    var requestContext      = request.requestContext;

                    dialogueService.retrieveDialogues(requestContext, dialogueIds, function(throwable, dialogueMap) {
                        _this.processRetrieveEachResponse(responder, throwable, dialogueIds, dialogueMap, callback);
                    });
                }
            });
            callback();
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(DialogueController).with(
        controller("dialogueController")
            .args([
                arg().ref("expressApp"),
                arg().ref("bugCallRouter"),
                arg().ref("dialogueService"),
                arg().ref("marshaller")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.DialogueController', DialogueController);
});
