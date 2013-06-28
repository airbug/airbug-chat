//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RoomMemberListContainer')

//@Require('Class')
//@Require('airbug.ListView')
//@Require('airbug.RoomMemberCollection')
//@Require('airbug.RoomMemberListItemContainer')
//@Require('airbug.RoomMemberModel')
//@Require('airbug.TextView')
//@Require('airbug.UserNameView')
//@Require('airbug.UserStatusIndicatorView')
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

var Class                           = bugpack.require('Class');
var ListView                        = bugpack.require('airbug.ListView');
var RoomMemberCollection            = bugpack.require('airbug.RoomMemberCollection');
var RoomMemberListItemContainer     = bugpack.require('airbug.RoomMemberListItemContainer');
var RoomMemberModel                 = bugpack.require('airbug.RoomMemberModel');
var TextView                        = bugpack.require('airbug.TextView');
var UserNameView                    = bugpack.require('airbug.UserNameView');
var UserStatusIndicatorView         = bugpack.require('airbug.UserStatusIndicatorView');
var Annotate                        = bugpack.require('annotate.Annotate');
var AutowiredAnnotation             = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation              = bugpack.require('bugioc.PropertyAnnotation');
var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


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

var RoomMemberListContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(roomModel) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {RoomMemberCollection}
         */
        this.roomMemberCollection = null;

        /**
         * @private
         * @type {RoomModel}
         */
        this.roomModel = roomModel;


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
         * @type {ListView}
         */
        this.listView = null;
    },

    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------


    //-------------------------------------------------------------------------------
    // CarapaceController Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function(routingArgs) {
        this._super(routingArgs);
        console.log("routingArgs:", routingArgs);

        var roomId = routingArgs[0];

        // Create Models
        //-------------------------------------------------------------------------------

        this.loadRoomMemberCollection(roomId);


        // Create Views
        //-------------------------------------------------------------------------------

        this.listView = view(ListView).build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.listView);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.roomMemberCollection.bind("add", this.handleRoomMemberCollectionAdd, this);
        this.roomModel.bind('change:uuid', this.handleRoomModelChangeUuid, this);
        this.listView.addEventListener(ListViewEvent.EventType.ITEM_SELECTED, this.hearListViewItemSelectedEvent, this);
    },


    //-------------------------------------------------------------------------------
    // Protected Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {string} roomId
     */
    loadRoomMemberCollection: function(roomId) {
        //TODO BRN: This is where we make an apiPublisher call and send both the roomUuid and the roomMemberCollection.
        // The api call would then be responsible for adding RoomMemberModels to the roomMemberCollection.
        var _this = this;
        this.roomMemberCollection = new RoomMemberCollection([], roomId);
        var room = this.roomManagerModule.get(roomId);
        var membersList = room.membersList;
        // membersList.forEach(function(roomMember){
        //     var roomMember = this.roomMemberManagerModule.get(roomMember.id);
        //     _this.roomMemberCollection.add(new RoomMemberModel(roomMember));
        // });
        this.addCollection(this.roomMemberCollection);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {ListViewEvent} event
     */
    hearListViewItemSelectedEvent: function(event) {
        var roomMember = event.getData();
        this.navigationModule.navigate("room-member/" + roomMember.uuid, {
            trigger: true
        });
    },


    //-------------------------------------------------------------------------------
    // Model Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @param {RoomMemberModel} roomMemberModel
     */
    handleRoomMemberCollectionAdd: function(roomMemberModel) {
        var roomMemberListItemContainer = new RoomMemberListItemContainer(roomMemberModel);
        this.addContainerChild(roomMemberListItemContainer, "#list-" + this.listView.cid);
    },

    /**
     * @private
     */
    handleRoomModelChangeUuid: function() {
        this.loadRoomMemberCollection(this.roomModel.get('uuid'));
    }
});

annotate(RoomMemberListContainer).with(
    autowired().properties([
        property("navigationModule").ref("navigationModule"),
        property("roomManagerModule").ref("roomManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomMemberListContainer", RoomMemberListContainer);
