//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ContactChatPageContainer')

//@Require('AccountButtonDropdownContainer')
//@Require('ApplicationContainer')
//@Require('Class')
//@Require('ConversationListSlidePanelContainer')
//@Require('HomeButtonContainer')
//@Require('PageTwoColumnView')
//@Require('RoomChatBoxContainer')
//@Require('RoomMemberListPanelContainer')
//@Require('RoomModel')
//@Require('ViewBuilder')


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
         * @type {PageTwoColumnView}
         */
        this.pageTwoColumnView = null;
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

        this.contactModel = new ContactModel({}, "contactModel");
        this.addModel(this.contactModel);


        // Create Views
        //-------------------------------------------------------------------------------

        this.pageTwoColumnView =
            view(PageTwoColumnView)
                .attributes({configuration: PageTwoColumnView.Configuration.THIN_RIGHT})
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.applicationView.addViewChild(this.pageTwoColumnView, "#application-" + this.applicationView.cid);
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

        //TEST
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
