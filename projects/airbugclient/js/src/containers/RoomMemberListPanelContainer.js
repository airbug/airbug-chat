//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('RoomMemberListPanelContainer')

//@Require('ButtonView')
//@Require('CarapaceContainer')
//@Require('Class')
//@Require('ListView')
//@Require('NavigationMessage')
//@Require('PanelWithHeaderView')
//@Require('RoomMemberCollection')
//@Require('RoomMemberModel')
//@Require('SelectableListItemView')
//@Require('TextView')
//@Require('UserNameView')
//@Require('UserStatusIndicatorView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomMemberListPanelContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(apiPublisher, roomModel) {

        this._super(apiPublisher);


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


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ButtonView}
         */
        this.addRoomMemberButtonView = null;

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

        /**
         * @private
         * @type {TextView}
         */
        this.textView = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<*>} routerArgs
     */
    activateContainer: function(routerArgs) {
        this._super(routerArgs);
        //TODO BRN:
    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------

        this.roomMemberCollection = new RoomMemberCollection();
        this.addModel(this.roomMemberCollection);


        // Create Views
        //-------------------------------------------------------------------------------

        this.addRoomMemberButtonView = new ButtonView({size: ButtonView.Size.SMALL});
        this.listView = new ListView({});
        this.panelView = new PanelWithHeaderView({headerTitle: "Room Members"});
        this.textView = new TextView({text: "+"});


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.addRoomMemberButtonView.addViewChild(this.textView, "#button-" + this.addRoomMemberButtonView.cid);
        this.panelView.addViewChild(this.addRoomMemberButtonView, "#panel-header-nav-" + this.panelView.cid);
        this.panelView.addViewChild(this.listView, "#panel-body-" + this.panelView.cid);
        this.setViewTop(this.panelView);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.roomMemberCollection.bind('add', this.handleRoomMemberCollectionAdd, this);
        this.roomModel.bind('change:uuid', this.handleRoomModelChangeUuid, this);
        this.listView.addEventListener(ListViewEvent.EventTypes.ITEM_SELECTED, this.hearListViewItemSelectedEvent, this);
    },

    /**
     * @protected
     */
    destroyContainer: function() {
        this._super();
        this.roomMemberCollection = null;
        this.roomModel = null;
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
            this.roomMemberCollection.add(new RoomMemberModel({uuid: "aN9o234", firstName: "Tim", lastName: "Pote", status: "away"}));
            this.roomMemberCollection.add(new RoomMemberModel({uuid: "nv40pfs", firstName: "Brian", lastName: "Neisler", status: "available"}));
            this.roomMemberCollection.add(new RoomMemberModel({uuid: "amvp06d", firstName: "Adam", lastName: "Nisenbaum", status: "dnd"}));
            this.roomMemberCollection.add(new RoomMemberModel({uuid: "djGh4DA", firstName: "Tom", lastName: "Raic", status: "offline"}));
        } else if (roomUuid === "nb0psdf") {
            this.roomMemberCollection.add(new RoomMemberModel({uuid: "nv40pfs", firstName: "Brian", lastName: "Neisler", status: "available"}));
            this.roomMemberCollection.add(new RoomMemberModel({uuid: "amvp06d", firstName: "Adam", lastName: "Nisenbaum", status: "dnd"}));
            this.roomMemberCollection.add(new RoomMemberModel({uuid: "djGh4DA", firstName: "Tom", lastName: "Raic", status: "offline"}));
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
        this.apiPublisher.publish(NavigationMessage.MessageTopics.NAVIGATE, {
            fragment: "contact/" + roomMember.uid,
            options: {
                trigger: true
            }
        });
    },


    //-------------------------------------------------------------------------------
    // Model Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {RoomMemberModel} roomMemberModel
     */
    handleRoomMemberCollectionAdd: function(roomMemberModel) {
        var selectableListItemView = new SelectableListItemView({
            model: roomMemberModel
        });
        var userNameView = new UserNameView({
            model: roomMemberModel,
            classes: "text-simple"
        });
        var userStatusIndicatorView = new UserStatusIndicatorView({
            model: roomMemberModel
        });
        selectableListItemView.addViewChild(userStatusIndicatorView, '#list-item-' + selectableListItemView.cid);
        selectableListItemView.addViewChild(userNameView, '#list-item-' + selectableListItemView.cid);
        this.listView.addViewChild(selectableListItemView);
    },

    /**
     * @private
     */
    handleRoomModelChangeUuid: function() {
        this.loadRoomMemberCollection(this.roomModel.get('uuid'));
    }
});
