//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('UserHomePageContainer')

//@Require('Class')
//@Require('airbug.ApplicationContainer')
//@Require('airbug.CreateRoomFormContainer')
//@Require('airbug.LogoutButtonContainer')
//@Require('airbug.PageView')
//@Require('airbug.RoomListPanelContainer')
//@Require('airbug.TwoColumnView')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var ApplicationContainer        = bugpack.require('airbug.ApplicationContainer');
var CreateRoomFormContainer     = bugpack.require('airbug.CreateRoomFormContainer');
var LogoutButtonContainer       = bugpack.require('airbug.LogoutButtonContainer');
var PageView                    = bugpack.require('airbug.PageView');
var RoomListPanelContainer      = bugpack.require('airbug.RoomListPanelContainer');
var TwoColumnView               = bugpack.require('airbug.TwoColumnView');
var ViewBuilder                 = bugpack.require('carapace.ViewBuilder');


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
         * @type {LogoutButtonContainer}
         */
        this.logoutButtonContainer      = null;

        /**
         * @private
         * @type {CreateRoomFormContainer}
         */
        this.createRoomFormContainer    = null;

        /**
         * @private
         * @type {RoomListPanelContainer}
         */
        this.roomListPanelContainer     = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @type {PageView}
         */
        this.pageView          = null;
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

        this.pageView =
            view(PageView)
                .children([
                    view(TwoColumnView)
                        .attributes({configuration: PageTwoColumnView.Configuration.DEFAULT})
                ])
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
        this.logoutButtonContainer      = new LogoutButtonContainer();
        this.createRoomFormContainer    = new CreateRoomFormContainer();
        this.roomListPanelContainer     = new RoomListPanelContainer();
        this.addContainerChild(this.logoutButtonContainer, '#header-right');
        this.addContainerChild(this.roomListPanelContainer, ".column1of2");
        this.addContainerChild(this.createRoomFormContainer, ".column2of2");
    },

    activateContainer: function(routingArgs){
        this._super(routingArgs);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.UserHomePageContainer", UserHomePageContainer);
