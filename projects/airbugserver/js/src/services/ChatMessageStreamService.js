//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.ChatMessageStreamService')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('MappedThrowable')
//@Require('Obj')
//@Require('airbugserver.EntityService')
//@Require('Flows')
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

    var Class                   = bugpack.require('Class');
    var Exception               = bugpack.require('Exception');
    var MappedThrowable         = bugpack.require('MappedThrowable');
    var Obj                     = bugpack.require('Obj');
    var EntityService           = bugpack.require('airbugserver.EntityService');
    var Flows                 = bugpack.require('Flows');
    var ModuleTag        = bugpack.require('bugioc.ModuleTag');
    var PropertyTag      = bugpack.require('bugioc.PropertyTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                 = BugMeta.context();
    var module                  = ModuleTag.module;
    var property                = PropertyTag.property;
    var $series                 = Flows.$series;
    var $task                   = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EntityService}
     */
    var ChatMessageStreamService = Class.extend(EntityService, {

        _name: "airbugserver.ChatMessageStreamService",


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
             * @type {ChatMessageStreamManager}
             */
            this.chatMessageStreamManager   = null;

            /**
             * @private
             * @type {ChatMessageStreamPusher}
             */
            this.chatMessageStreamPusher    = null;

            /**
             * @private
             * @type {ConversationManager}
             */
            this.conversationManager        = null;

            /**
             * @private
             * @type {ConversationSecurity}
             */
            this.conversationSecurity       = null;
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
        createChatMessageStream: function(requestContext, entityObject, callback) {
            //TODO
            callback(new Exception("UnauthorizedAccess", {}, "Not implemented"));
        },

        /*
         * @param {RequestContext} requestContext
         * @param {string} entityId
         * @param {function(Throwable, Entity=} callback
         */
        deleteChatMessageStream: function(requestContext, entityId, callback) {
            //TODO
            callback(new Exception("UnauthorizedAccess", {}, "Not implemented"));
        },

        /**
         * @param {RequestContext} requestContext
         * @param {string} entityId
         * @param {function(Throwable, ChatMessageStream=)} callback
         */
        retrieveChatMessageStream: function(requestContext, entityId, callback) {
            var _this               = this;
            var currentUser         = requestContext.get("currentUser");
            var call                = requestContext.get("call");
            var chatMessageStream   = null;
            var conversation        = null;

            $series([
                $task(function(flow) {
                    _this.conversationManager.retrieveConversation(entityId, function(throwable, returnedConversation) {
                        if (!throwable) {
                            conversation = returnedConversation;
                            flow.complete(throwable);
                        } else {
                            flow.error(new Exception("NotFound", {}, "Could not find Conversation with the id '" + conversationId + "'"))
                        }
                    });
                }),
                $task(function(flow) {
                    _this.conversationManager.populateConversation(conversation, ["owner"], function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.conversationSecurity.checkConversationReadAccess(currentUser, conversation, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    chatMessageStream = _this.chatMessageStreamManager.generateChatMessageStream({
                        id: entityId
                    });
                    _this.chatMessageStreamPusher.meldCallWithChatMessageStream(call.getCallUuid(), chatMessageStream, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.chatMessageStreamPusher.pushChatMessageStreamToCall(chatMessageStream, call.getCallUuid(), function(throwable) {
                        flow.complete(throwable);
                    })
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    callback(null, chatMessageStream);
                } else {
                    callback(throwable);
                }
            });
        },

        /*
         * @param {RequestContext} requestContext
         * @param {string} chatMessageId
         * @param {{*}} updates
         * @param {function(Throwable, ChatMessage} callback
         */
        updateChatMessageStream: function(requestContext, chatMessageId, updates, callback) {
            callback(new Exception("UnauthorizedAccess", {}, "Not implemented"));
        }


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(ChatMessageStreamService).with(
        module("chatMessageStreamService")
            .properties([
                property("chatMessageStreamManager").ref("chatMessageStreamManager"),
                property("chatMessageStreamPusher").ref("chatMessageStreamPusher"),
                property("conversationManager").ref("conversationManager"),
                property("conversationSecurity").ref("conversationSecurity")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.ChatMessageStreamService', ChatMessageStreamService);
});
