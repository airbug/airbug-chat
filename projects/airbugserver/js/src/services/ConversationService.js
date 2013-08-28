//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ConversationService')

//@Require('Class')
//@Require('Obj')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ConversationService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(conversationManager, userManager){

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChatMessageManager}
         */
        this.conversationManager    = conversationManager;

        /**
         * @private
         * @type {UserManager}
         */
        this.userManager            = userManager;
    },


    //-------------------------------------------------------------------------------
    // Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {User} currentUser
     * @param {ObjectId} conversationId
     * @param {function(Error, Conversation)} callback
     */
    retrieveConversation: function(currentUser, conversationId, callback) {
        var _this = this;
        console.log("Inside of ConversationService#retrieveConversation");
        this.conversationManager.findById(conversationId, function(error, conversation){
            console.log("Error:", error);
            console.log("Conversation:", conversation);
            if(!error && conversation){
                //NOTE This is HACKY. CurrentUser should always be updating itself after any change is made to its corresponding data model
                _this.userManager.findById(currentUser.id, function(error, returnedUser){
                    if(!error && returnedUser){
                        if (returnedUser.roomsList.indexOf(conversation.ownerId) > -1) {
                            callback(null, conversation);
                        } else {
                            callback(new Error("Unauthorized Access"), null);
                        }
                    } else {
                        callback(error);
                    }
                });
            } else if(!error) {
                callback(new Error("No conversation found with id of " + conversationId), null);
            } else {
                callback(error, null);
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ConversationService', ConversationService);
