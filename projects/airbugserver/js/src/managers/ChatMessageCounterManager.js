//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.ChatMessageCounterManager')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('TypeUtil')
//@Require('airbugserver.ChatMessageCounter')
//@Require('bugentity.EntityManager')
//@Require('bugentity.EntityManagerTag')
//@Require('bugioc.ArgTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Exception                   = bugpack.require('Exception');
var TypeUtil                    = bugpack.require('TypeUtil');
var ChatMessageCounter          = bugpack.require('airbugserver.ChatMessageCounter');
var EntityManager               = bugpack.require('bugentity.EntityManager');
var EntityManagerTag     = bugpack.require('bugentity.EntityManagerTag');
var ArgTag               = bugpack.require('bugioc.ArgTag');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                         = ArgTag.arg;
var bugmeta                     = BugMeta.context();
var entityManager               = EntityManagerTag.entityManager;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatMessageCounterManager = Class.extend(EntityManager, {

    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------


    /**
     * @param {ChatMessageCounter} chatMessageCounter
     * @param {(Array.<string> | function(Throwable, ChatMessage=))} dependencies
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
     * @param {function(Throwable, number=)} callback
     */
    getNextIndexByConversationId: function(conversationId, callback) {
        this.getDataStore().findOneAndUpdate(
            { conversationId: conversationId },
            { $inc: { count: 1 } },
            { new: true, upsert: true},
            function(error, chatMessageCounter) {
                if (error) {
                    callback(error);
                } else {
                    if (chatMessageCounter) {
                        callback(null, chatMessageCounter.count);
                    } else {
                        callback(new Exception("NotFound", {}, "No ChatMessageCounter found"));
                    }
                }
            }
        );
    },

    /**
     * @param {string} conversationId
     * @param {function(Throwable, number=)} callback
     */
    getCountByConversationId: function(conversationId, callback) {
        this.getDataStore().find(
            { conversationId: conversationId },
            function(error, chatMessageCounter) {
                if (!error) {
                    if (chatMessageCounter) {
                        callback(null, chatMessageCounter.count);
                    } else {
                        callback(null, 0);
                    }
                } else {
                    callback(new Exception("MongoError", {}, "Error occurred in mongo db", [error]));
                }
            }
        );
    },

    /**
     * @param {string} conversationId
     * @param {function(Throwable, ChatMessageCounter=)} callback
     */
    retrieveChatMessageCounterByConversationId: function(conversationId, callback) {
        var _this = this;
        this.getDataStore()
            .where("conversationId", conversationId)
            .lean(true)
            .exec(function(throwable, dbObject) {
                if (!throwable) {
                    var entityObject = null;
                    if (!dbObject || dbObject.length === 0) {
                        _this.getDataStore().create({conversationId: conversationId}, function(throwable, chatMessageCounter){
                            if (!throwable) {
                                if (TypeUtil.isArray(chatMessageCounter)) {
                                    chatMessageCounter = chatMessageCounter[0];
                                }
                                entityObject = _this.convertDbObjectToEntity(chatMessageCounter);
                                entityObject.commitDelta();
                                callback(null, entityObject);
                            } else {
                                callback(throwable);
                            }
                        });
                    } else {
                        if (TypeUtil.isArray(dbObject)) {
                            dbObject = dbObject[0];
                        }
                        entityObject = _this.convertDbObjectToEntity(dbObject);
                        entityObject.commitDelta();
                        callback(null, entityObject);
                    }
                } else {
                    callback(throwable);
                }
            });
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(ChatMessageCounterManager).with(
    entityManager("chatMessageCounterManager")
        .ofType("ChatMessageCounter")
        .args([
            arg().ref("entityManagerStore"),
            arg().ref("schemaManager"),
            arg().ref("mongoDataStore"),
            arg().ref("entityDeltaBuilder")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessageCounterManager', ChatMessageCounterManager);
