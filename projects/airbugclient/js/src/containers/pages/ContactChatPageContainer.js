//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ContactChatPageContainer')

//@Require('Class')
//@Require('airbug.AccountButtonDropdownContainer')
//@Require('airbug.ApplicationContainer')
//@Require('airbug.ContactChatBoxContainer')
//@Require('airbug.ContactModel')
//@Require('airbug.ConversationListSlidePanelContainer')
//@Require('airbug.HomeButtonContainer')
//@Require('airbug.PageView')
//@Require('airbug.RoomChatBoxContainer')
//@Require('airbug.RoomMemberListPanelContainer')
//@Require('airbug.RoomModel')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                                   = bugpack.require('Class');
var AccountButtonDropdownContainer          = bugpack.require('airbug.AccountButtonDropdownContainer');
var ApplicationContainer                    = bugpack.require('airbug.ApplicationContainer');
var ContactChatBoxContainer                 = bugpack.require('airbug.ContactChatBoxContainer');
var ContactModel                            = bugpack.require('airbug.ContactModel');
var ConversationListSlidePanelContainer     = bugpack.require('airbug.ConversationListSlidePanelContainer');
var HomeButtonContainer                     = bugpack.require('airbug.HomeButtonContainer');
var PageView                                = bugpack.require('airbug.PageView');
var RoomChatBoxContainer                    = bugpack.require('airbug.RoomChatBoxContainer');
var RoomMemberListPanelContainer            = bugpack.require('airbug.RoomMemberListPanelContainer');
var RoomModel                               = bugpack.require('airbug.RoomModel');
var ViewBuilder                             = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ContactChatPageContainer = Class.extend(ApplicationContainer, {

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
         * @type {AccountButtonDropdownContainer}
         */
        this.accountButtonDropdownContainer = null;

        /**
         * @private
         * @type {ContactChatBoxContainer}
         */
        this.contactChatBoxContainer = null;

        /**
         * @private
         * @type {ConversationListSlidePanelContainer}
         */
        this.conversationListSlidePanelContainer = null;

        /**
         * @private
         * @type {HomeButtonContainer}
         */
        this.homeButtonContainer = null;


        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ContactModel}
         */
        this.contactModel = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @type {PageView}
         */
        this.pageView = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<*>} routerArgs
     */
    activateContainer: function(routerArgs) {
        this._super(routerArgs);
        var contactUuid = routerArgs[0];
        this.loadContactModel(contactUuid);
    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------

        this.contactModel = new ContactModel({});
        this.addModel("contactModel", this.contactModel);


        // Create Views
        //-------------------------------------------------------------------------------

        this.pageView =
            view(PageView)
                .attributes({configuration: PageTwoColumnView.Configuration.THIN_RIGHT})
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.applicationView.addViewChild(this.pageView, "#application-" + this.applicationView.cid);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.accountButtonDropdownContainer = new AccountButtonDropdownContainer();
        this.contactChatBoxContainer = new ContactChatBoxContainer(this.contactModel);
        this.conversationListSlidePanelContainer = new ConversationListSlidePanelContainer();
        this.homeButtonContainer = new HomeButtonContainer();
        this.addContainerChild(this.accountButtonDropdownContainer, '#header-right');
        this.addContainerChild(this.contactChatBoxContainer, "#page-leftrow");
        this.addContainerChild(this.conversationListSlidePanelContainer, "#page-rightrow");
        this.addContainerChild(this.homeButtonContainer, "#header-left");
    },

    /**
     * @protected
     */
    destroyContainer: function() {
        this._super();
        this.userModel = null;
    },


    //-------------------------------------------------------------------------------
    // Protected Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {string} uuid
     */
    loadContactModel: function(uuid) {
        // TODO BRN: Load the Contact associated with the passed in uuid.
        // TODO BRN: Send the contact uuid and the ContactModel to the API. It's the API's responsibility to change the model

        if (uuid === "aN9o234") {
            this.contactModel.set({uuid: "aN9o234", userUuid: "nmhsieh", conversationUuid: "1aRtls0"}); //Tim
        } else if (uuid === "nv40pfs") {
            this.contactModel.set({uuid: "nv40pfs", userUuid: "a93hdug", conversationUuid: "lm7497s"}); //Brian
        } else if (uuid === "amvp06d") {
            this.contactModel.set({uuid: "amvp06d", userUuid: "18dh7fn", conversationUuid: "g7pfcnd"}); //Adam
        } else if (uuid === "djGh4DA") {
            this.contactModel.set({uuid: "djGh4DA", userUuid: "pm8e6ds", conversationUuid: "ldhsyin"}); //Tom
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ContactChatPageContainer", ContactChatPageContainer);
