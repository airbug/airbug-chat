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

    createChatMessage: function(chatMessageBody, conversationId, conversationOwnerId, callback){
        var requestData = {
            chatMessage: {
                body: chatMessageBody,
                conversationId: conversationId,
                conversationOwnerId: conversationOwnerId
            }
        };
        this.bugCallClient.request("createChatMessage", requestData, callback);
    },


    //-------------------------------------------------------------------------------
    // Conversation Related Api Methods
    //-------------------------------------------------------------------------------

    retrieveConversation: function(conversationId, callback){
        var requestData = {
            conversationId: conversationId
        };
        this.bugCallClient.request("retrieveConversation", requestData, callback);
    },


    //-------------------------------------------------------------------------------
    // Room Related Api Methods
    //-------------------------------------------------------------------------------

    addUserToRoom: function(userId, roomId, callback){
        var requestData = {
            roomId: roomId,
            userId: userId
        };
        this.bugCallClient.request("addUserToRoom", requestData, callback);
    },

    createRoom: function(roomName, callback){
        var requestData = {
            room: {
                name: roomName
            }
        };
        this.bugCallClient.request("createRoom", requestData, callback);
    },

    joinRoom: function(roomId, callback){
        var requestData = {
            roomId: roomId
        };
        this.bugCallClient.request("joinRoom", requestData, callback);
    },

    leaveRoom: function(roomId, callback){
        var requestData = {
            roomId: roomId
        };
        this.bugCallClient.request("leaveRoom", requestData, callback);
    },


    //-------------------------------------------------------------------------------
    // User Related Api Methods
    //-------------------------------------------------------------------------------

    getCurrentUser: function(callback){
        this.bugCallClient.request("getCurrentUser", {}, callback);
    },

    establishCurrentUser: function(firstName, lastName, email, callback){
        var requestData = {
            user: {
                firstName: firstName,
                lastName: lastName,
                email: email
            }
        };
        this.bugCallClient.request("establishCurrentUser", requestData, callback);

    },

    logoutCurrentUser: function(callback){
        this.bugCallClient.request("logoutCurrentUser", {}, callback);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.AirbugApi", AirbugApi);
