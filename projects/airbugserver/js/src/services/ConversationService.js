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

//@Export('airbugserver.ConversationService')
//@Autoload

//@Require('Bug')
//@Require('Class')
//@Require('Exception')
//@Require('Flows')
//@Require('Obj')
//@Require('airbugserver.EntityService')
//@Require('bugioc.ModuleTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Bug             = bugpack.require('Bug');
    var Class           = bugpack.require('Class');
    var Exception       = bugpack.require('Exception');
    var Flows           = bugpack.require('Flows');
    var Obj             = bugpack.require('Obj');
    var EntityService   = bugpack.require('airbugserver.EntityService');
    var ModuleTag       = bugpack.require('bugioc.ModuleTag');
    var PropertyTag     = bugpack.require('bugioc.PropertyTag');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta         = BugMeta.context();
    var module          = ModuleTag.module;
    var property        = PropertyTag.property;
    var $series         = Flows.$series;
    var $task           = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EntityService}
     */
    var ConversationService = Class.extend(EntityService, {

        _name: "airbugserver.ConversationService",


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
             * @private
             * @type {ChatMessageManager}
             */
            this.conversationManager    = null;

            /**
             * @private
             * @type {ConversationPusher}
             */
            this.conversationPusher     = null;

            /**
             * @private
             * @type {ConversationSecurity}
             */
            this.conversationSecurity   = null;
        },


        //-------------------------------------------------------------------------------
        // Methods
        //-------------------------------------------------------------------------------

        /*
         * @param {RequestContext} requestContext
         * @param {{*}} conversation
         * @param {function(Throwable, Conversation)} callback
         */
        createConversation: function(requestContext, conversation, callback) {
            //TODO
        },

        /*
         * @param {RequestContext} requestContext
         * @param {string} conversationId
         * @param {function(Throwable)} callback
         */
        deleteConversation: function(requestContext, conversationId, callback) {
            //TODO
        },

        /**
         * @param {RequestContext} requestContext
         * @param {string} conversationId
         * @param {function(Throwable, Conversation=)} callback
         */
        retrieveConversation: function(requestContext, conversationId, callback) {
            var _this               = this;
            var currentUser         = requestContext.get("currentUser");
            var call                = requestContext.get("call");
            var conversation        = null;

            $series([
                $task(function(flow) {
                    _this.dbRetrievePopulatedConversation(conversationId, function(throwable, returnedConversation) {

                        //TODO BRN: Is it ok for non-room members to retrieve a conversation?
                        if (!throwable) {
                            if (returnedConversation) {
                                conversation = returnedConversation;
                                flow.complete();
                            } else {
                                flow.error(new Exception("NotFound", {}, "Could not find conversation by the id '" + conversationId + "'"));
                            }
                        } else {
                            flow.error(throwable);
                        }
                    });
                }),
                $task(function(flow) {
                    _this.conversationSecurity.checkConversationReadAccess(currentUser, conversation, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.conversationPusher.meldCallWithConversation(call.getCallUuid(), conversation, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.conversationPusher.meldCallWithConversation(call.getCallUuid(), conversation, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.conversationPusher.pushConversationToCall(conversation, call.getCallUuid(), function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    callback(null, conversation);
                } else {
                    callback(throwable);
                }
            });
        },

        /*
         * @param {RequestContext} requestContext
         * @param {string} conversationId
         * @param {{*}} updates
         * @param {function(Throwable, Conversation)} callback
         */
        updateConversation: function(requestContext, conversationId, updates, callback) {
            //TODO
        },

        // Convenience Retrieve Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Conversation} conversation
         * @param {function(Throwable, Conversation=)} callback
         */
        dbPopulateConversation: function(conversation, callback) {
            var _this = this;
            $series([
                $task(function(flow) {
                    _this.conversationManager.populateConversation(conversation, ["owner"], function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    callback(null, conversation);
                } else {
                    callback(throwable);
                }
            });
        },

        /**
         * @param {string} conversationId
         * @param {function(Throwable, Conversation=)} callback
         */
        dbRetrievePopulatedConversation: function(conversationId, callback) {
            var _this               = this;
            var conversation        = null;
            var conversationManager = this.conversationManager;
            $series([
                $task(function(flow) {
                    conversationManager.retrieveConversation(conversationId, function(throwable, returnedConversation) {
                        if (!throwable) {
                            if (returnedConversation) {
                                conversation = returnedConversation;
                            } else {
                                throwable = new Exception("NotFound", {objectId: conversationId}, "Could not find conversation with the id '" + conversationId + "'");
                            }
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.dbPopulateConversation(conversation, function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    callback(null, conversation);
                } else {
                    callback(throwable);
                }
            });
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(ConversationService).with(
        module("conversationService")
            .properties([
                property("conversationManager").ref("conversationManager"),
                property("conversationPusher").ref("conversationPusher"),
                property("conversationSecurity").ref("conversationSecurity")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.ConversationService', ConversationService);
});
