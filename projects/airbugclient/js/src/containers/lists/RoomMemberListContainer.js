//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('RoomMemberListContainer')

//@Require('Annotate')
//@Require('AnnotateProperty')
//@Require('CarapaceContainer')
//@Require('Class')
//@Require('ListView')
//@Require('RoomMemberCollection')
//@Require('RoomMemberListItemContainer')
//@Require('RoomMemberModel')
//@Require('TextView')
//@Require('UserNameView')
//@Require('UserStatusIndicatorView')
//@Require('ViewBuilder')


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate = Annotate.annotate;
var annotation = Annotate.annotation;
var property = AnnotateProperty.property;
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
        this.listView.addEventListener(ListViewEvent.EventTypes.ITEM_SELECTED, this.hearListViewItemSelectedEvent, this);
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

        //TEST
        if (roomUuid === "g13Dl0s") {
            //TEST
            this.roomMemberCollection.add(new RoomMemberModel({uuid: "akdbvo2", userUuid: "nmhsieh", conversationUuid: "1aRtls0"})); //Tim
            this.roomMemberCollection.add(new RoomMemberModel({uuid: "39dbclc", userUuid: "a93hdug", conversationUuid: "lm7497s"})); //Brian
            this.roomMemberCollection.add(new RoomMemberModel({uuid: "9rbeudb", userUuid: "18dh7fn", conversationUuid: "g7pfcnd"})); //Adam
            this.roomMemberCollection.add(new RoomMemberModel({uuid: "mduekp0", userUuid: "pm8e6ds", conversationUuid: "ldhsyin"})); //Tom
        } else if (roomUuid === "nb0psdf") {
            //TEST
            this.roomMemberCollection.add(new RoomMemberModel({uuid: "39dbclc", userUuid: "a93hdug", conversationUuid: "lm7497s"})); //Brian
            this.roomMemberCollection.add(new RoomMemberModel({uuid: "9rbeudb", userUuid: "18dh7fn", conversationUuid: "g7pfcnd"})); //Adam
            this.roomMemberCollection.add(new RoomMemberModel({uuid: "mduekp0", userUuid: "pm8e6ds", conversationUuid: "ldhsyin"})); //Tom
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
    annotation("Autowired").params(
        property("navigationModule").ref("navigationModule")
    )
);
