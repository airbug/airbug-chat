//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('AirbugApi')

//@Require('Class')
//@Require('Obj')
//@Require('Queue')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class   = bugpack.require('Class');
var Obj     = bugpack.require('Obj');
var Queue   = bugpack.require('Queue');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AirbugApi = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(bugCallClient) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BugCallClient}
         */
        this.bugCallClient = bugCallClient;
    },


    //-------------------------------------------------------------------------------
    // Instance Methods
    //-------------------------------------------------------------------------------

    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------


    //-------------------------------------------------------------------------------
    // ChatMessage Related Api Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} chatMessageBody
     * @param {string} conversationOwnerId
     * @param {string} conversationId
     * @param {function(error, chatMessage)} callback
     */
    createChatMessage: function(chatMessageBody, senderUserId, conversationId, conversationOwnerId, callback){
        var requestData = {
            chatMessage: {
                body: chatMessageBody,
                senderUserId: senderUserId, //NOTE: used to validate against serverside currentUser
                conversationId: conversationId,
                conversationOwnerId: conversationOwnerId
            }
        };

        /**
         * @param {string} requestType
         * @param {{*}} requestData
         * @param {function(Exception, CallResponse)} callback
         */
        this.bugCallClient.request("createChatMessage", requestData, function(exception, callResponse){
            if(!exception){
                var type        = callResponse.getType();
                var data        = callResponse.getData();
                var error       = data.error;
                var chatMessage = data.chatMessage;
                callback(error, chatMessage);
            } else {
                callback(exception, null);
            }
        });
    },

    //NOTE: For Dev/Testing Purposes. Needs refined functions
    retrieveChatMessagesByConversationId: function(conversationId, callback){
        var requestData = {
            conversationId: conversationId
        };
        this.bugCallClient.request("retrieveChatMessagesByConversationId", requestData, function(exception, callResponse){
            if(!exception){
                var type            = callResponse.getType();
                var data            = callResponse.getData();
                var error           = data.error;
                var chatMessages    = data.chatMessages;
                callback(error, chatMessages);
            } else {
                callback(exception, null);
            }
        });
    },


    //-------------------------------------------------------------------------------
    // Conversation Related Api Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} conversationId
     * @param {function(error, conversation)} callback
     */
    retrieveConversation: function(conversationId, callback){
        var requestData = {
            conversationId: conversationId
        };
        this.bugCallClient.request("retrieveConversation", requestData, function(exception, callResponse){
            if(!exception){
                var type            = callResponse.getType();
                var data            = callResponse.getData();
                var error           = data.error;
                var conversation    = data.conversation;
                callback(error, conversation);
            } else {
                callback(exception, null);
            }
        });
    },


    //-------------------------------------------------------------------------------
    // Room Related Api Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} userId
     * @param {string} roomId
     * @param {function(error, room)} callback
     */
    addUserToRoom: function(userId, roomId, callback){
        var requestData = {
            roomId: roomId,
            userId: userId
        };
        this.bugCallClient.request("addUserToRoom", requestData, function(exception, callResponse){
            if(!exception){
                var type    = callResponse.getType();
                var data    = callResponse.getData();
                var error   = data.error;
                var room    = data.room;
                callback(error, room);
            } else {
                callback(exception, null);
            }
        });
    },

    /**
     * @param {{}} roomObj
     * @param {function(error, room, user)} callback
     */
    createRoom: function(roomObj, callback){
        var requestData = {
            room: {
                name: roomObj.name
            }
        };
        this.bugCallClient.request("createRoom", requestData, function(exception, callResponse){
            if(!exception){
                var type    = callResponse.getType();
                var data    = callResponse.getData();
                var error   = data.error;
                var room    = data.room;
                var user    = data.user; //TODO: Should this be kept here?
                //
                console.log("AirbugApi#createRoom results: user:", user, "room:", room);
                //
                callback(error, room, user);
            } else {
                callback(exception, null);
            }
        });
    },

    /**
     * @param {string} roomId
     * @param {function(error, room)} callback
     */
    joinRoom: function(roomId, callback){
        var requestData = {
            roomId: roomId
        };
        this.bugCallClient.request("joinRoom", requestData, function(exception, callResponse){
            if(!exception){
                var type    = callResponse.getType();
                var data    = callResponse.getData();
                var error   = data.error;
                var room    = data.room;
                callback(error, room);
            } else {
                callback(exception, null);
            }
        });
    },

    /**
     * @param {string} roomId
     * @param {function(error)} callback
     */
    leaveRoom: function(roomId, callback){
            var requestData = {
                roomId: roomId
            };
            this.bugCallClient.request("leaveRoom", requestData, function(exception, callResponse){
                if(!exception){
                    var type    = callResponse.getType();
                    var data    = callResponse.getData();
                    var error   = data.error;
                    var roomId  = data.roomId;
                    callback(error, roomId);
                } else {
                    callback(exception, null);
                }
            });
    },

    retrieveRoom: function(roomId, callback){
        var requestType = "retrieveRoom";
        var requestData = {
            roomId: roomId
        };
        this.bugCallClient.request(requestType, requestData, function(exception, callResponse){
            if(!exception){
                var type    = callResponse.getType();
                var data    = callResponse.getData();
                var error   = data.error;
                var room    = data.room;
                callback(error, room);
            } else {
                callback(exception, null);
            }
        });
    },

    retrieveRooms: function(roomIds, callback){
        var requestType = "retrieveRooms";
        var requestData = {
            roomIds: roomIds
        };
        this.bugCallClient.request(requestType, requestData, function(exception, callResponse){
            if(!exception){
                var type    = callResponse.getType();
                var data    = callResponse.getData();
                var error   = data.error;
                var rooms   = data.rooms;
                callback(error, rooms);
            } else {
                callback(exception, null);
            }
        });
    },


    //-------------------------------------------------------------------------------
    // User Related Api Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {}
     * @param {}
     */
    getCurrentUser: function(callback){
            this.bugCallClient.request("getCurrentUser", {}, function(exception, callResponse){
                if(!exception){
                    var type        = callResponse.getType();
                    var data        = callResponse.getData();
                    var error       = data.error;
                    var currentUser = data.user;
                    callback(error, currentUser);
                } else {
                    callback(exception, null);
                }
            });
    },

    loginUser: function(callback){
        // this.bugCallClient.createConnection();
        this.bugCallClient.openConnection();
        callback();
    },

    /**
     * @param {function(error)} callback
     */
    logoutCurrentUser: function(callback){
        var _this = this;
        this.bugCallClient.request("logoutCurrentUser", {}, function(exception, callResponse){
            if(!exception){
                var type        = callResponse.getType();
                var data        = callResponse.getData();
                var error       = data.error;
                console.log("Inside AirbugApi logoutCurrentUser");
                if(!error){
                    // console.log("destroying connection");
                    // _this.bugCallClient.destroyConnection();
                    callback();
                } else {
                    callback(error);
                }
            } else {
                callback(exception, null);
            }
        });
    },

    registerUser: function(callback){
        this.bugCallClient.createConnection();
        this.bugCallClient.openConnection();
        callback();
    },

    retrieveUser: function(userId, callback){
        var requestType = "retrieveUser";
        var requestData = {
            userId: userId
        };
        this.bugCallClient.request(requestType, requestData, function(exception, callResponse){
            if(!exception){
                var type    = callResponse.getType();
                var data    = callResponse.getData();
                var error   = data.error;
                var user    = data.user;
                callback(error, user);
            } else {
                callback(exception, null);
            }
        });
    },

    retrieveUsers: function(userIds, callback){
        var requestType = "retrieveUsers";
        var requestData = {
            userIds: userIds
        };
        this.bugCallClient.request(requestType, requestData, function(exception, callResponse){
            if(!exception){
                var type    = callResponse.getType();
                var data    = callResponse.getData();
                var error   = data.error;
                var users   = data.users;
                callback(error, users);
            } else {
                callback(exception, null);
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.AirbugApi", AirbugApi);
