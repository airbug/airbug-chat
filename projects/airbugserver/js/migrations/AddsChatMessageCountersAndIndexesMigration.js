//script
// AddsChatMessageCountersAndIndexesMigration MongoDB


var db = connect("10.209.21.90");
var conversations = db.conversations.find();
var getNextIndex = function getNextIndex(conversationId) {
    var counter = db.chatmessagecounters.findAndModify(
        {
            query: { conversationId: conversationId },
            update: { $inc: { count: 1 } },
            new: true,
            upsert: true
        }
    );

    return counter.count;
};

conversations.forEach(function(conversation){
    db.chatmessagecounters.insert({
        conversationId: conversation._id,
        count: 0,
        createdAt: Date.now(),
        updatedAt: Date.now()
    });
});

conversations.forEach(function(conversation){
    var conversationId = conversation._id;
    var chatMessageArrays = [];
    var chatMessages = db.chatmessages.find({
        query: {conversationId: conversationId},
        sort: {sentAt: 1}
    });

    while (chatMessages.length > 0) {
        chatMessageArrays.unshift(tempChatMessages);
        var oldestSentAt = tempChatMessages[0].sentAt;
        chatMessages = db.chatmessages.find({
            conversationId: conversationId,
            sentBy: {$lt: oldestSentAt},
            sort: {sentAt: 1}
        });
    }

    chatMessageArrays.forEach(function(chatMessages){
        chatMessages.forEach(function(chatMessage){
            chatMessage.index = getNextIndex(conversationId);
            chatMessage.updatedAt = Date.now();
            db.chatmessages.save(chatMessage);
        });
    });

});
