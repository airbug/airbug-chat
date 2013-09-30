//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ConversationManager')

//@Require('Class')
//@Require('Set')
//@Require('TypeUtil')
//@Require('airbugserver.Conversation')
//@Require('airbugserver.EntityManager')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Set                 = bugpack.require('Set');
var TypeUtil            = bugpack.require('TypeUtil');
var Conversation        = bugpack.require('airbugserver.Conversation');
var EntityManager       = bugpack.require('airbugserver.EntityManager');
var BugFlow             = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $parallel           = BugFlow.$parallel;
var $series             = BugFlow.$series;
var $task               = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ConversationManager = Class.extend(EntityManager, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(mongoDataStore) {

        this._super(mongoDataStore);

    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {{
     *      chatMessageIdSet: (Array.<string> | List.<string>),
     *      createdAt: Date,
     *      id: string,
     *      ownerId: string,
     *      updatedAt: Date
     * }} data
     * @return {Conversation}
     */
    generateConversation: function(requestContext, data) {
        var conversation = new Conversation();
        if (!TypeUtil.isUndefined(data.chatMessageIdSet)) {
            conversation.setChatMessageIdList(new Set(data.chatMessageIdSet));
        }
        if (TypeUtil.isUndefined(data.createdAt)) {
            conversation.setCreatedAt(data.createdAt);
        }
        conversation.setId(data.id);
        conversation.setOwnerId(data.ownerId);
        conversation.setUpdatedAt(data.updatedAt);
        return conversation;
    },

    /**
     * @param {string} id
     * @param {function(Error, Conversation)} callback
     */
    retrieveConversation: function(id, callback) {
        var _this = this;

        //TODO BRN: Look at using the "lean" option for retrieval to prevent from having to call .toObject on th dbRoom

        this.dataStore.findById(id, function(error, dbConversation) {
            if (!error) {
                var conversation = undefined;
                if (dbConversation) {
                    conversation = _this.generateConversation(dbConversation.toObject());
                    conversation.commitDelta();
                }
                callback(undefined, conversation);
            } else {
                callback(error);
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ConversationManager', ConversationManager);
