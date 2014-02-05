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
    conversationId: {type: ObjectId,    index: true,    required: true},
    createdAt:      {type: Date,                        required: true, default: Date.now}, //UPDATE remove checks from the managers
    index:          {type: Number,      index: true,    required: true, unique: false},
    senderUserId:   {type: ObjectId,    index: true,    required: true},
    sentAt:         {type: Date,        index: true,    required: true},
    tryUuid:        {type: String,      index: true,    required: true},
    type:           {type: String,                      required: true},
    updatedAt:      {type: Date,                        required: true, default: Date.now}
});

ChatMessageSchema.index({conversationId: 1, index: 1}, {unique: true});

/**
 * @return {number}
 */
ChatMessageSchema.statics.getNextIndexByConversationId = function(conversationId, callback) {
    ChatMessageCounterModel.findOneAndUpdate(
        { conversationId: conversationId },
        { $inc: { count: 1 } },
        { new: true, upsert: true},
        function(error, chatMessageCounter){
            if(error){
                callback(error);
            } else {
                if(chatMessageCounter){
                    callback(undefined, chatMessageCounter.count);
                } else {
                    callback(new Error("No chatMessageCounter found"));
                }
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
