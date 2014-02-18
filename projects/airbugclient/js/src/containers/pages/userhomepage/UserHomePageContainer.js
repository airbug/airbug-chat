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
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
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
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var AutowiredAnnotation         = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation          = bugpack.require('bugioc.PropertyAnnotation');
var ViewBuilder                 = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired                   = AutowiredAnnotation.autowired;
var bugmeta                     = BugMeta.context();
var property                    = PropertyAnnotation.property;
var view                        = ViewBuilder.view;


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

        /**
         * @private
         * @type {DocumentUtil}
         */
        this.documentUtil               = null;


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
    // CarapaceContainer Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array.<*>} routingArgs
     */
    activateContainer: function(routingArgs) {
        this._super(routingArgs);
        this.documentUtil.setTitle("Home page - airbug");
    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();

        // Create Views
        //-------------------------------------------------------------------------------

        view(PageView)
            .name("pageView")
            .children([
                view(TwoColumnView)
                    .attributes({configuration: TwoColumnView.Configuration.DEFAULT})
                    .appendTo("#page-{{cid}}")
            ])
            .build(this);


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.getApplicationView().addViewChild(this.pageView, "#application-{{cid}}");

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
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(UserHomePageContainer).with(
    autowired().properties([
        property("documentUtil").ref("documentUtil")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.UserHomePageContainer", UserHomePageContainer);
