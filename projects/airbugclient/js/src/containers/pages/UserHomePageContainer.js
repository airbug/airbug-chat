//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('UserHomePageContainer')

//@Require('AccountButtonDropdownContainer')
//@Require('ApplicationContainer')
//@Require('Class')
//@Require('ContactListPanelContainer')
//@Require('ConversationListPanelContainer')
//@Require('PageThreeColumnView')
//@Require('RoomListPanelContainer')
//@Require('ViewBuilder')


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserHomePageContainer = Class.extend(ApplicationContainer, {

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
         * @type {ContactListPanelContainer}
         */
        this.contactListPanelContainer = null;

        /**
         * @private
         * @type {ConversationListPanelContainer}
         */
        this.conversationListPanelContainer = null;

        /**
         * @private
         * @type {RoomListPanelContainer}
         */
        this.roomListPanelContainer = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @type {PageThreeColumnView}
         */
        this.pageThreeColumnView = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function() {
        this._super();

        // Create Views
        //-------------------------------------------------------------------------------

        this.pageThreeColumnView =
            view(PageThreeColumnView)
                .attributes({configuration: PageThreeColumnView.Configuration.DEFAULT})
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.applicationView.addViewChild(this.pageThreeColumnView, "#application-" + this.applicationView.cid);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.accountButtonDropdownContainer = new AccountButtonDropdownContainer();
        this.contactListPanelContainer = new ContactListPanelContainer();
        this.conversationListPanelContainer = new ConversationListPanelContainer();
        this.roomListPanelContainer = new RoomListPanelContainer();
        this.addContainerChild(this.accountButtonDropdownContainer, '#header-right');
        this.addContainerChild(this.contactListPanelContainer, "#page-leftrow");
        this.addContainerChild(this.conversationListPanelContainer, "#page-centerrow");
        this.addContainerChild(this.roomListPanelContainer, "#page-rightrow");
    }
});
