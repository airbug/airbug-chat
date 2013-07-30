//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RoomListPanelContainer')

//@Require('Class')
//@Require('airbug.ListView')
//@Require('airbug.ListViewEvent')
//@Require('airbug.PanelWithHeaderView')
//@Require('airbug.RoomCollection')
//@Require('airbug.RoomModel')
//@Require('airbug.RoomNameView')
//@Require('airbug.SelectableListItemView')
//@Require('airbug.TextView')
//@Require('annotate.Annotate')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var ListView                    = bugpack.require('airbug.ListView');
var ListViewEvent               = bugpack.require('airbug.ListViewEvent');
var PanelWithHeaderView         = bugpack.require('airbug.PanelWithHeaderView');
var RoomCollection              = bugpack.require('airbug.RoomCollection');
var RoomModel                   = bugpack.require('airbug.RoomModel');
var RoomNameView                = bugpack.require('airbug.RoomNameView');
var SelectableListItemView      = bugpack.require('airbug.SelectableListItemView');
var TextView                    = bugpack.require('airbug.TextView');
var Annotate                    = bugpack.require('annotate.Annotate');
var AutowiredAnnotation         = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation          = bugpack.require('bugioc.PropertyAnnotation');
var CarapaceContainer           = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                 = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate    = Annotate.annotate;
var autowired   = AutowiredAnnotation.autowired;
var property    = PropertyAnnotation.property;
var view        = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomListPanelContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {RoomCollection}
         */
        this.roomCollection = null;


        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {NavigationModule}
         */
        this.navigationModule = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ButtonView}
         */
        this.addRoomButtonView = null;

        /**
         * @private
         * @type {ListView}
         */
        this.listView = null;

        /**
         * @private
         * @type {PanelView}
         */
        this.panelView = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<*>} routerArgs
     */
    activateContainer: function(routerArgs) {
        var _this = this;
        this._super(routerArgs);
        var rooms = this.roomManagerModule.getAll();
        rooms.forEach(function(roomObj){
            _this.roomCollection.add(new RoomModel(roomObj, roomObj._id));
        });
    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------

        this.roomCollection = new RoomCollection([], "roomCollection");
        this.addCollection(this.roomCollection);


        // Create Views
        //-------------------------------------------------------------------------------

        this.panelView =
        view(PanelWithHeaderView)
            .attributes({headerTitle: "Rooms"})
            .children([
                view(ListView)
                    .id("listView")
                    .appendTo('*[id|="panel-body"]')
            ])
            .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.panelView);
        this.addRoomButtonView  = this.findViewById("addRoomButtonView");
        this.listView           = this.findViewById("listView");
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.roomCollection.bind('add', this.handleRoomCollectionAdd, this);
        this.listView.addEventListener(ListViewEvent.EventType.ITEM_SELECTED, this.hearListViewItemSelectedEvent, this);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {ListViewEvent} event
     */
    hearListViewItemSelectedEvent: function(event) {
        var room    = event.getData();
        var roomId  = room.id || room._id; //BUGBUG room.id current = "";
        this.navigationModule.navigate("room/" + roomId, {
            trigger: true
        });
    },


    //-------------------------------------------------------------------------------
    // Model Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @param {RoomModel} roomModel
     */
    handleRoomCollectionAdd: function(roomModel) {
        var selectableListItemView =
            view(SelectableListItemView)
                .model(roomModel)
                .children([
                    view(RoomNameView)
                        .model(roomModel)
                        .attributes({classes : "text-simple"})
                        .appendTo('*[id|="list-item"]')
                ])
                .build();

        this.listView.addViewChild(selectableListItemView);
    }
});

annotate(RoomListPanelContainer).with(
    autowired().properties([
        property("navigationModule").ref("navigationModule"),
        property("roomManagerModule").ref("roomManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomListPanelContainer", RoomListPanelContainer);
