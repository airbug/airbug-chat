//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ChatMessageCounterManager')
//@Autoload

//@Require('Class')
//@Require('TypeUtil')
//@Require('airbugserver.ChatMessageCounter')
//@Require('airbugserver.ChatMessageCounterModel')
//@Require('bugentity.EntityManager')
//@Require('bugentity.EntityManagerAnnotation')
//@Require('bugioc.ArgAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var ChatMessageCounter          = bugpack.require('airbugserver.ChatMessageCounter');
var ChatMessageCounterModel     = bugpack.require('airbugserver.ChatMessageCounterModel');
var EntityManager               = bugpack.require('bugentity.EntityManager');
var EntityManagerAnnotation     = bugpack.require('bugentity.EntityManagerAnnotation');
var ArgAnnotation               = bugpack.require('bugioc.ArgAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var TypeUtil                    = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                         = ArgAnnotation.arg;
var bugmeta                     = BugMeta.context();
var entityManager               = EntityManagerAnnotation.entityManager;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatMessageCounterManager = Class.extend(EntityManager, {

    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {ChatMessageCounter} chatMessageCounter
     * @param {(Array.<string> | function(Throwable, ChatMessage))} dependencies
     * @param {function(Throwable, ChatMessage=)=} callback
     */
    createChatMessageCounter: function(chatMessageCounter, dependencies, callback) {
        if (TypeUtil.isFunction(dependencies)) {
            callback        = dependencies;
            dependencies    = [];
        }
        var options         = {};
        this.create(chatMessageCounter, options, dependencies, callback);
    },

    /**
     * @param {{
     *      conversationId: string,
     *      count: number,
     *      createdAt: Date,
     *      updatedAt: Date
     * }} data
     * @return {ChatMessageCounter}
     */
    generateChatMessageCounter: function(data) {
        var chatMessageCounter = new ChatMessageCounter(data);
        this.generate(chatMessageCounter);
        return chatMessageCounter;
    },

    /**
     * @param {string} conversationId
     * @param {function(Throwable, ChatMessageCounter)} callback
     */
    retrieveChatMessageCounterByConversationId: function(conversationId, callback) {
        var _this = this;
        this.dataStore
            .where("conversationId", conversationId)
            .lean(true)
            .exec(function(throwable, dbObject) {
                if (!throwable) {
                    var entityObject = null;
                    if (!dbObject || dbObject.length === 0) {
                        ChatMessageCounterModel.create({conversationId: conversationId}, function(throwable, chatMessageCounter){
                            if(!throwable){
                                if(TypeUtil.isArray(chatMessageCounter)){
                                    var chatMessageCounter = chatMessageCounter[0];
                                }
                                entityObject = _this.convertDbObjectToEntity(chatMessageCounter);
                                entityObject.commitDelta();
                                callback(undefined, entityObject);
                            } else {
                                callback(throwable, undefined);
                            }
                        });
                    } else {
                        if(TypeUtil.isArray(dbObject)){
                            dbObject = dbObject[0];
                        }
                        entityObject = _this.convertDbObjectToEntity(dbObject);
                        entityObject.commitDelta();
                        callback(undefined, entityObject);
                    }
                } else {
                    callback(throwable, undefined);
                }
            });
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(ChatMessageCounterManager).with(
    entityManager("chatMessageCounterManager")
        .ofType("ChatMessageCounter")
        .args([
            arg().ref("entityManagerStore"),
            arg().ref("schemaManager"),
            arg().ref("mongoDataStore")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessageCounterManager', ChatMessageCounterManager);
