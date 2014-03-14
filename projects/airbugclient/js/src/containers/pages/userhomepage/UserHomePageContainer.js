//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('UserHomePageContainer')

//@Require('Class')
//@Require('airbug.CreateRoomFormContainer')
//@Require('airbug.LogoutButtonContainer')
//@Require('airbug.MultiColumnView')
//@Require('airbug.PageContainer')
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
var CreateRoomFormContainer     = bugpack.require('airbug.CreateRoomFormContainer');
var LogoutButtonContainer       = bugpack.require('airbug.LogoutButtonContainer');
var MultiColumnView             = bugpack.require('airbug.MultiColumnView');
var PageContainer               = bugpack.require('airbug.PageContainer');
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

var UserHomePageContainer = Class.extend(PageContainer, {

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
         * @type {TwoColumnView}
         */
        this.twoColumnView          = null;
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

        view(TwoColumnView)
            .name("twoColumnView")
            .attributes({
                configuration: TwoColumnView.Configuration.THICK_RIGHT_SMALL,
                rowStyle: MultiColumnView.RowStyle.FLUID
            })
            .build(this);

        this.fourColumnView.addViewChild(this.twoColumnView, ".column2of4");
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
        this.addContainerChild(this.roomListPanelContainer, ".2column-container .column1of2");
        this.addContainerChild(this.createRoomFormContainer, ".2column-container .column2of2");
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
