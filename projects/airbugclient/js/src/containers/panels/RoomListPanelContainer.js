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
//@Require('bugmeta.BugMeta')
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
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var AutowiredAnnotation         = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation          = bugpack.require('bugioc.PropertyAnnotation');
var CarapaceContainer           = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                 = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta     = BugMeta.context();
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
         * @type {airbug.RoomCollection}
         */
        this.roomCollection             = null;


        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {airbug.CurrentUserManagerModule}
         */
        this.currentUserManagerModule   = null;

        /**
         * @private
         * @type {airbug.NavigationModule}
         */
        this.navigationModule           = null;

        /**
         * @private
         * @type {airbug.NavigationModule}
         */
        this.roomManagerModule          = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {airbug.ButtonView}
         */
        this.addRoomButtonView          = null;

        /**
         * @private
         * @type {airbug.ListView}
         */
        this.listView                   = null;

        /**
         * @private
         * @type {airbug.PanelView}
         */
        this.panelView                  = null;
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
        //NOTE: The adding of rooms will occur asynchronously but should be well handled by backbone
        this.currentUserManagerModule.retrieveCurrentUser(function(error, currentUserMeldObj){
            if(!error && currentUserMeldObj){
                var currentUserObj = currentUserMeldObj.generateObject();
                _this.roomManagerModule.retrieveRooms(currentUserObj.roomsList, function(error, roomMeldObjs){
                    if(!error && roomMeldObjs){
                        roomMeldObjs.forEach(function(roomMeldObj){
                            if(roomMeldObj){ // in case roomMeldObj is null e.g. no longer exists
                                var roomObj = roomMeldObj.generateObject();
                                _this.roomCollection.add(roomObj, roomObj._id);
                            }
                        });
                    } else {
                        //TODO Error handling
                        //TODO Error tracking
                        var parentContainer     = _this.getContainerParent();
                        var notificationView    = parentContainer.getNotificationView();
                        console.log("error:", error);
                        notificationView.flashError(error);
                    }
                });
            } else {
                //TODO
                //flash error
            }
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
        var roomId  = room.id || room._id; //BUGBUG room.id currently returns "";
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

bugmeta.annotate(RoomListPanelContainer).with(
    autowired().properties([
        property("currentUserManagerModule").ref("currentUserManagerModule"),
        property("navigationModule").ref("navigationModule"),
        property("roomManagerModule").ref("roomManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomListPanelContainer", RoomListPanelContainer);
