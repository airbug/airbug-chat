//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('AlphaHomePageContainer')

//@Require('Class')
//@Require('airbug.AccountButtonDropdownContainer')
//@Require('airbug.ApplicationContainer')
//@Require('airbug.ContactListPanelContainer')
//@Require('airbug.ConversationListPanelContainer')
//@Require('airbug.PageThreeColumnView')
//@Require('airbug.RoomListPanelContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =                             bugpack.require('Class');
var AccountButtonDropdownContainer =    bugpack.require('airbug.AccountButtonDropdownContainer');
var ApplicationContainer =              bugpack.require('airbug.ApplicationContainer');
var ContactListPanelContainer =         bugpack.require('airbug.ContactListPanelContainer');
var ConversationListPanelContainer =    bugpack.require('airbug.ConversationListPanelContainer');
var PageThreeColumnView =               bugpack.require('airbug.PageThreeColumnView');
var RoomListPanelContainer =            bugpack.require('airbug.RoomListPanelContainer');
var ViewBuilder =                       bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AlphaHomePageContainer = Class.extend(ApplicationContainer, {

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


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.AlphaHomePageContainer", AlphaHomePageContainer);
