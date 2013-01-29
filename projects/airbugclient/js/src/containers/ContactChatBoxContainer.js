//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ContactChatBoxContainer')

//@Require('Class')
//@Require('airbug.BoxWithHeaderView')
//@Require('airbug.ChatWidgetContainer')
//@Require('airbug.ConversationModel')
//@Require('airbug.UserNamePanelContainer')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =                     bugpack.require('Class');
var BoxWithHeaderView =         bugpack.require('airbug.BoxWithHeaderView');
var ChatWidgetContainer =       bugpack.require('airbug.ChatWidgetContainer');
var ConversationModel =         bugpack.require('airbug.ConversationModel');
var UserNamePanelContainer =    bugpack.require('airbug.UserNamePanelContainer');
var CarapaceContainer =         bugpack.require('carapace.CarapaceContainer');
var ViewBuilder =               bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ContactChatBoxContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(contactModel) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChatWidgetContainer}
         */
        this.chatWidgetContainer = null;

        /**
         * @private
         * @type {UserNamePanelContainer}
         */
        this.userNamePanelContainer = null;


        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ContactModel}
         */
        this.contactModel = contactModel;

        /**
         * @private
         * @type {ConversationModel}
         */
        this.conversationModel = null;

        /**
         * @private
         * @type {UserModel}
         */
        this.userModel = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BoxWithHeaderView}
         */
        this.boxWithHeaderView = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<*>} routerArgs
     */
    activateContainer: function(routerArgs) {
        this._super(routerArgs);
        //TODO BRN:


    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------

        this.conversationModel = new ConversationModel({}, "conversationModel");
        this.userModel = new UserModel({}, "userModel");
        this.addModel(this.conversationModel);
        this.addModel(this.userModel);


        // Create Views
        //-------------------------------------------------------------------------------

        this.boxWithHeaderView = view(BoxWithHeaderView).build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.boxWithHeaderView);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.chatWidgetContainer = new ChatWidgetContainer(this.conversationModel);
        this.userNamePanelContainer = new UserNamePanelContainer(this.userModel);
        this.addContainerChild(this.chatWidgetContainer, "#box-body-" + this.boxWithHeaderView.cid);
        this.addContainerChild(this.userNamePanelContainer, "#box-header-" + this.boxWithHeaderView.cid);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.contactModel.bind('change:conversationUuid', this.handleContactModelChangeConversationUuid, this);
        this.contactModel.bind('change:userUuid', this.handleContactModelChangeUserUuid, this);
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {string} conversationUuid
     */
    loadConversationModel: function(conversationUuid) {
        // TODO BRN: Load the Conversation associated with the passed in uuid.
        // TODO BRN: Send the conversation uuid and the conversationModel to the API. It's the API's responsibility to change the model

        this.conversationModel.set("uuid", conversationUuid);
    },

    /**
     * @protected
     * @param {string} userUuid
     */
    loadUserModel: function(userUuid) {
        // TODO BRN: Load the User associated with the passed in uuid.
        // TODO BRN: Send the user uuid and the userModel to the API. It's the API's responsibility to change the model

        //TEST
        if (userUuid === "nmhsieh") {
            this.userModel.set({uuid:"nmhsieh", firstName: "Tim", lastName: "Pote", status: "away"});
        } else if (userUuid === "a93hdug") {
            this.userModel.set({uuid: "a93hdug", firstName: "Brian", lastName: "Neisler", status: "available"})
        } else if (userUuid === "18dh7fn") {
            this.userModel.set({uuid: "18dh7fn", firstName: "Adam", lastName: "Nisenbaum", status: "dnd"});
        } else if (userUuid === "pm8e6ds") {
            this.userModel.set({uuid: "pm8e6ds", firstName: "Tom", lastName: "Raic", status: "offline"})
        }
    },


    //-------------------------------------------------------------------------------
    // Model Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    handleContactModelChangeConversationUuid: function() {
        this.loadConversationModel(this.contactModel.get('conversationUuid'));
    },

    /**
     * @private
     */
    handleContactModelChangeUserUuid: function() {
        this.loadUserModel(this.contactModel.get('userUuid'));
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ContactChatBoxContainer", ContactChatBoxContainer);
