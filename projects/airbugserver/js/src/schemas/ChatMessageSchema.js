//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ChatMessageSchema')
//@Autoload

//@Require('airbugserver.ChatMessageCounterModel')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();
var mongoose    = require('mongoose');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var ChatMessageCounterModel = bugpack.require('airbugserver.ChatMessageCounterModel');
var Schema                  = mongoose.Schema;
var Mixed                   = mongoose.Schema.Types.Mixed;
var ObjectId                = mongoose.Schema.Types.ObjectId;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatMessageSchema = new Schema({
    body: {type: Mixed},
    conversationId: {type: ObjectId, index: true, required: true},
    createdAt: Date, //UPDATE to required: true, default: Date.now and remove checks from the managers
    index: {type: Number, index: true, required: true, unique: true},
    senderUserId: {type: ObjectId, index: true, required: true},
    sentAt: {type: Date, index: true, required: true},
    tryUuid: {type: String, index: true, required: true},
    type: {type: String, required: true},
    updatedAt: Date
});

/**
 * @return {number}
 */
ChatMessageSchema.statics.getNextIndexByConversationId = function(conversationId, callback) {
    ChatMessageCounterModel.findOneAndUpdate(
        { conversationId: conversationId },
        { $inc: { count: 1 } },
        { new: true, upsert: true},
        function(error, chatMessageCounter){
            if(chatMessageCounter){
                callback(error, chatMessageCounter.count);
            } else {
                callback(error);
            }
        }
    );
};

ChatMessageSchema.statics.getCountByConversationId = function(conversationId, callback) {
    ChatMessageCounterModel.find(
        { conversationId: conversationId },
        function(error, chatMessageCounter) {
            var count = chatMessageCounter.count;
            callback(error, count);
        }
    );
};

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessageSchema', ChatMessageSchema);
