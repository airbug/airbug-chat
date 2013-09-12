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

var Class                           = bugpack.require('Class');
var ListView                        = bugpack.require('airbug.ListView');
var RoomMemberCollection            = bugpack.require('airbug.RoomMemberCollection');
var RoomMemberListItemContainer     = bugpack.require('airbug.RoomMemberListItemContainer');
var RoomMemberModel                 = bugpack.require('airbug.RoomMemberModel');
var TextView                        = bugpack.require('airbug.TextView');
var UserNameView                    = bugpack.require('airbug.UserNameView');
var UserStatusIndicatorView         = bugpack.require('airbug.UserStatusIndicatorView');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var AutowiredAnnotation             = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation              = bugpack.require('bugioc.PropertyAnnotation');
var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


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
        this.roomMemberCollection   = null;

        /**
         * @private
         * @type {RoomModel}
         */
        this.roomModel              = roomModel;


        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {NavigationModule}
         */
        this.navigationModule       = null;

        /**
         * @private
         * @type {RoomManagModule}
         */
        this.roomManagerModule      = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ListView}
         */
        this.listView               = null;
    },

    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------


    //-------------------------------------------------------------------------------
    // CarapaceController Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<*>} routerArgs
     */
    activateContainer: function(routingArgs) {
        this._super(routingArgs);
    },

    /**
     * @protected
     * @param {Array<*>} routerArgs
     */
    createContainer: function(routingArgs) {
        this._super(routingArgs);
        //NOTE: routingArgs are undefined here

        // @type id of roomModel NOTE: Should be the same as _id of roomObj
        var roomId = this.roomModel.get("_id");

        // Create Models
        //-------------------------------------------------------------------------------

        this.roomMemberCollection = new RoomMemberCollection([], roomId);
        this.addCollection(this.roomMemberCollection);


        // Create Views
        //-------------------------------------------------------------------------------

        this.listView = view(ListView)
                            .attributes({trackingId: "roomMemberListContainer", trackingClasses: ["list"]})
                            .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.listView);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        var roomId = this.roomModel.get("id");
        console.log("Initializing RoomMemberListContainer");
        this._super();
        this.roomMemberCollection.bind("add", this.handleRoomMemberCollectionAdd, this);
        this.roomModel.bind('change:_id', this.handleRoomModelChangeId, this);
        this.listView.addEventListener(ListViewEvent.EventType.ITEM_SELECTED, this.hearListViewItemSelectedEvent, this);

        this.loadRoomMemberCollection(roomId);

    },


    //-------------------------------------------------------------------------------
    // Protected Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {string} roomId
     */
    loadRoomMemberCollection: function(roomId) {
        if(!roomId) var roomId = this.roomModel.get("_id");
        var _this = this;
        // NOTE: This should no longer be a populated list
        var membersList = this.roomModel.get("membersList");
        this.retrieveRoomMembers(membersList, function(error, roomMemberMeldObjs){
            if(!error && roomMemberMeldObjs){
                roomMemberMeldObjs.forEach(function(roomMemberMeldObj){
                    var roomMemberObj = roomMemberMeldObj.generateObject();
                    var roomMemberModel = new RoomMemberModel(roomMemberObj, roomMemberObj._id);
                    _this.roomMemberCollection.add(roomMemberModel);
                });
            } else {
                //TODO Handle exceptions where a retry would be appropriate
                console.log("RoomMemberListContainer#loadRoomMemberCollection error");
                console.log("error:", error, "roomMemberMeldObjs:", roomMemberMeldObjs);
            }
        });
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
    handleRoomModelChangeId: function() {
        this.loadRoomMemberCollection(this.roomModel.get('_id'));
    }
});

bugmeta.annotate(RoomMemberListContainer).with(
    autowired().properties([
        property("navigationModule").ref("navigationModule"),
        property("roomManagerModule").ref("roomManagerModule"),
        property("userManagerModule").ref("userManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomMemberListContainer", RoomMemberListContainer);
