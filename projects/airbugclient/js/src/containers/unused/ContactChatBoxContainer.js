//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ContactChatBoxContainer')

//@Require('Class')
//@Require('airbug.BoxWithHeaderView')
//@Require('airbug.ChatWidgetContainer')
//@Require('airbug.ConversationModel')
//@Require('airbug.UserModel')
//@Require('airbug.UserNamePanelContainer')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var BoxWithHeaderView       = bugpack.require('airbug.BoxWithHeaderView');
var ChatWidgetContainer     = bugpack.require('airbug.ChatWidgetContainer');
var UserModel               = bugpack.require('airbug.UserModel');
var UserNamePanelContainer  = bugpack.require('airbug.UserNamePanelContainer');
var CarapaceContainer       = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder             = bugpack.require('carapace.ViewBuilder');


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

    _constructor: function() {

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
        this.chatWidgetContainer = new ChatWidgetContainer();
        this.userNamePanelContainer = new UserNamePanelContainer(this.userModel);
        this.addContainerChild(this.chatWidgetContainer, "#box-body-" + this.boxWithHeaderView.cid);
        this.addContainerChild(this.userNamePanelContainer, "#box-header-" + this.boxWithHeaderView.cid);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();

    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {string} conversationId
     */
    loadConversation: function(conversationId) {
        //TODO BRN
    },

    /**
     * @protected
     * @param {string} userId
     */
    loadUser: function(userId) {
        //TODO BRN
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ContactChatBoxContainer", ContactChatBoxContainer);
