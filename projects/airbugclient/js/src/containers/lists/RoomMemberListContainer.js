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

var Class =                         bugpack.require('Class');
var ListView =                      bugpack.require('airbug.ListView');
var RoomMemberCollection =          bugpack.require('airbug.RoomMemberCollection');
var RoomMemberListItemContainer =   bugpack.require('airbug.RoomMemberListItemContainer');
var RoomMemberModel =               bugpack.require('airbug.RoomMemberModel');
var TextView =                      bugpack.require('airbug.TextView');
var UserNameView =                  bugpack.require('airbug.UserNameView');
var UserStatusIndicatorView =       bugpack.require('airbug.UserStatusIndicatorView');
var Annotate =                      bugpack.require('annotate.Annotate');
var AutowiredAnnotation =           bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation =            bugpack.require('bugioc.PropertyAnnotation');
var CarapaceContainer =             bugpack.require('carapace.CarapaceContainer');
var ViewBuilder =                   bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate = Annotate.annotate;
var autowired = AutowiredAnnotation.autowired;
var property = PropertyAnnotation.property;
var view = ViewBuilder.view;


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
    // CarapaceController Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------

        this.roomMemberCollection = new RoomMemberCollection([], "roomMemberCollection");
        this.addCollection(this.roomMemberCollection);


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
     * @param {string} roomUuid
     */
    loadRoomMemberCollection: function(roomUuid) {
        //TODO BRN: This is where we make an apiPublisher call and send both the roomUuid and the roomMemberCollection.
        // The api call would then be responsible for adding RoomMemberModels to the roomMemberCollection.

        if (roomUuid === "g13Dl0s") {
            this.roomMemberCollection.add(new RoomMemberModel({uuid: "akdbvo2", roomUuid: "g13Dl0s", userUuid: "nmhsieh", conversationUuid: "1aRtls0"})); //Tim
            this.roomMemberCollection.add(new RoomMemberModel({uuid: "39dbclc", roomUuid: "g13Dl0s", userUuid: "a93hdug", conversationUuid: "lm7497s"})); //Brian
            this.roomMemberCollection.add(new RoomMemberModel({uuid: "9rbeudb", roomUuid: "g13Dl0s", userUuid: "18dh7fn", conversationUuid: "g7pfcnd"})); //Adam
            this.roomMemberCollection.add(new RoomMemberModel({uuid: "mduekp0", roomUuid: "g13Dl0s", userUuid: "pm8e6ds", conversationUuid: "ldhsyin"})); //Tom
        } else if (roomUuid === "nb0psdf") {
            this.roomMemberCollection.add(new RoomMemberModel({uuid: "39dbclc", roomUuid: "nb0psdf", userUuid: "a93hdug", conversationUuid: "lm7497s"})); //Brian
            this.roomMemberCollection.add(new RoomMemberModel({uuid: "9rbeudb", roomUuid: "nb0psdf", userUuid: "18dh7fn", conversationUuid: "g7pfcnd"})); //Adam
            this.roomMemberCollection.add(new RoomMemberModel({uuid: "mduekp0", roomUuid: "nb0psdf", userUuid: "pm8e6ds", conversationUuid: "ldhsyin"})); //Tom
        }
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
        property("navigationModule").ref("navigationModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomMemberListContainer", RoomMemberListContainer);
