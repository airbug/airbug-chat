//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('UserHomePageContainer')

//@Require('AccountButtonContainer')
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

    _constructor: function(apiPublisher) {

        this._super(apiPublisher);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------


        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AccountButtonContainer}
         */
        this.accountButtonContainer = null;

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
        this.accountButtonContainer = new AccountButtonContainer(this.apiPublisher);
        this.contactListPanelContainer = new ContactListPanelContainer(this.apiPublisher);
        this.conversationListPanelContainer = new ConversationListPanelContainer(this.apiPublisher);
        this.roomListPanelContainer = new RoomListPanelContainer(this.apiPublisher);
        this.addContainerChild(this.accountButtonContainer, '#header-right');
        this.addContainerChild(this.contactListPanelContainer, "#page-leftrow");
        this.addContainerChild(this.conversationListPanelContainer, "#page-centerrow");
        this.addContainerChild(this.roomListPanelContainer, "#page-rightrow");
    }
});
