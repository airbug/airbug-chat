//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('UserHomePageContainer')

//@Require('Class')
//@Require('airbug.AccountButtonDropdownContainer')
//@Require('airbug.ApplicationContainer')
//@Require('airbug.CreateRoomFormContainer')
//@Require('airbug.PageTwoColumnView')
//@Require('airbug.RoomListPanelContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                               = bugpack.require('Class');
var AccountButtonDropdownContainer      = bugpack.require('airbug.AccountButtonDropdownContainer');
var ApplicationContainer                = bugpack.require('airbug.ApplicationContainer');
var CreateRoomFormContainer             = bugpack.require('airbug.CreateRoomFormContainer');
var PageTwoColumnView                   = bugpack.require('airbug.PageTwoColumnView');
var RoomListPanelContainer              = bugpack.require('airbug.RoomListPanelContainer');
var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


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
         * @type {CreateRoomFormContainer}
         */
        this.createRoomFormContainer        = null;

        /**
         * @private
         * @type {RoomListPanelContainer}
         */
        this.roomListPanelContainer         = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @type {PageTwoColumnView}
         */
        this.pageTwoColumnView              = null;
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

        this.pageTwoColumnView =
            view(PageTwoColumnView)
                .attributes({configuration: PageTwoColumnView.Configuration.DEFAULT})
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
        this.createRoomFormContainer        = new CreateRoomFormContainer();
        this.roomListPanelContainer         = new RoomListPanelContainer();
        this.addContainerChild(this.accountButtonDropdownContainer, '#header-right');
        this.addContainerChild(this.roomListPanelContainer, "#page-leftrow");
        this.addContainerChild(this.createRoomFormContainer, "#page-rightrow");
    },

    activateContainer: function(routingArgs){
        
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.UserHomePageContainer", UserHomePageContainer);
