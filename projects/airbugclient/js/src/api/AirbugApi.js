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
    createChatMessage: function(chatMessageBody, conversationId, conversationOwnerId, callback){
        var requestData = {
            chatMessage: {
                body: chatMessageBody,
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
            var type        = callResponse.getType();
            var data        = callResponse.getData();
            var error       = data.error();
            var chatMessage = data.chatMessage();
            callback(error, chatMessage);
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
            var type            = callResponse.getType();
            var data            = callResponse.getData();
            var error           = data.error;
            var conversation    = data.conversation;
            callback(error, conversation);
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
            var type    = callResponse.getType();
            var data    = callResponse.getData();
            var error   = data.error;
            var room    = data.room;
            callback(error, room);
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
            var type    = callResponse.getType();
            var data    = callResponse.getData();
            var error   = data.error;
            var room    = data.room;
            var user    = data.user; //TODO: Should this be kept?
            console.log("AirbugApi#createRoom results: user:", user, "room:", room);
            console.log("Should the user be kept in here?");

            callback(error, room, user);
        });
    },

    /**
     * @param {string} roomId
     * @param {}
     */
    joinRoom: function(roomId, callback){
        var requestData = {
            roomId: roomId
        };
        this.bugCallClient.request("joinRoom", requestData, function(exception, callResponse){
            var type    = callResponse.getType();
            var data    = callResponse.getData();
            var error   = data.error;
            var room    = data.room;
            callback(error, room);
        });
    },

    /**
     * @param {}
     * @param {}
     */
    leaveRoom: function(roomId, callback){
        var requestData = {
            roomId: roomId
        };
        this.bugCallClient.request("leaveRoom", requestData, function(exception, callResponse){
            var type    = callResponse.getType();
            var data    = callResponse.getData();
            var error   = data.error;
            var room    = data.room;
            callback(error, room);
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
            var type        = callResponse.getType();
            var data        = callResponse.getData();
            var error       = data.error;
            var currentUser = data.user;
            callback(error, currentUser);
        });
    },

    /**
     * @param {}
     * @param {}
     */
    // establishCurrentUser: function(userObj, callback){
    //     console.log("Inside AirbugApi#establishCurrentUser");
    //     console.log("userObj:", userObj, "callback:", callback);
    //     var requestData = {
    //         user: userObj
    //     };
    //     this.bugCallClient.request("establishCurrentUser", requestData, function(exception, callResponse){
    //         var type = callResponse.getType();
    //         var data = callResponse.getData();
    //         var error = data.error;
    //         var currentUser = data.user;
    //         callback(error, currentUser);
    //     });

    // },

    loginUser: function(userObj, callback){
        var requestType = "loginUser";
        var requestData = {
            user: {
                email: userObj.email
            }
        };
        this.bugCallClient.request(requestType, requestData, function(exception, callResponse){
            var type        = callResponse.getType();
            var data        = callResponse.getData();
            var error       = data.error;
            var currentUser = data.user;
            callback(error, currentUser); 
        });
    },

    /**
     * @param {function(error)} callback
     */
    logoutCurrentUser: function(callback){
        this.bugCallClient.request("logoutCurrentUser", {}, function(exception, callResponse){
            var type        = callResponse.getType();
            var data        = callResponse.getData();
            var error       = data.error;
            // var currentUser = data.user;
            callback(error);
        });
    },

    registerUser: function(userObj, callback){
        var requestType = "registerUser";
        var requestData = {
            user: {
                firstName:  userObj.firstName,
                lastName:   userObj.lastName,
                email:      userObj.email
            }
        };
        console.log(this.bugCallClient);
        this.bugCallClient.request(requestType, requestData, function(exception, callResponse){
            console.log("Inside of callback for bugCallClient within AirbugApi#registerUser");
            var type        = callResponse.getType();
            var data        = callResponse.getData();
            var error       = data.error;
            var currentUser = data.user;
            console.log("Type:", type, "data:", data);
            console.log("Error:", error, "currentUser:", currentUser);
            console.log("callback:", callback);
            callback(error, currentUser); 
        });
    },

    retrieveUser: function(userId, callback){
        var requestType = "retrieveUser";
        var requestData = {
            userId: userId
        };
        this.bugCallClient.request(requestType, requestData, function(exception, callResponse){
            var type    = callResponse.getType();
            var data    = callResponse.getData();
            var error   = data.error;
            var user    = data.user;
            callback(error, user);
        });
    },

    retrieveUsers: function(userIds, callback){
        var requestType = "retrieveUsers";
        var requestData = {
            userIds: userIds
        };
        this.bugCallClient.request(requestType, requestData, function(exception, callResponse){
            var type    = callResponse.getType();
            var data    = callResponse.getData();
            var error   = data.error;
            var users   = data.users;
            callback(error, users);
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.AirbugApi", AirbugApi);
