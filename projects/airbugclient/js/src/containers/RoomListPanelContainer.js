//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('RoomListPanelContainer')

//@Require('CarapaceContainer')
//@Require('Class')
//@Require('ListView')
//@Require('ListViewEvent')
//@Require('NavigationMessage')
//@Require('PanelWithHeaderView')
//@Require('RoomCollection')
//@Require('RoomModel')
//@Require('RoomNameView')
//@Require('SelectableListItemView')
//@Require('TextView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomListPanelContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(apiPublisher) {

        this._super(apiPublisher);


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

        //TEST
        this.roomCollection.add(new RoomModel({uuid: "g13Dl0s", name: "airbug Company Room"}));
        this.roomCollection.add(new RoomModel({uuid: "nb0psdf", name: "airbug Dev Room"}));
    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------

        this.roomCollection = new RoomCollection();
        this.addModel(this.roomCollection);


        // Create Views
        //-------------------------------------------------------------------------------

        this.addRoomButtonView = new ButtonView({size: ButtonView.Size.SMALL});
        this.listView = new ListView({});
        this.panelView = new PanelWithHeaderView({headerTitle: "Rooms"});
        this.textView = new TextView({text: "+"});


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.addRoomButtonView.addViewChild(this.textView, "#button-" + this.addRoomButtonView.cid);
        this.panelView.addViewChild(this.addRoomButtonView, "#panel-header-nav-" + this.panelView.cid);
        this.panelView.addViewChild(this.listView, "#panel-body-" + this.panelView.cid);
        this.setViewTop(this.panelView);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        var _this = this;
        this.roomCollection.bind('add', this.handleRoomCollectionAdd, this);
        this.listView.addEventListener(ListViewEvent.EventTypes.ITEM_SELECTED, this.hearListViewItemSelectedEvent, this);
    },

    /**
     * @protected
     */
    destroyContainer: function() {
        this._super();
        this.roomCollection = null;
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {ListViewEvent} event
     */
    hearListViewItemSelectedEvent: function(event) {
        var room = event.getData();
        this.apiPublisher.publish(NavigationMessage.MessageTopics.NAVIGATE, {
            fragment: "room/" + room.uuid,
            options: {
                trigger: true
            }
        });
    },


    //-------------------------------------------------------------------------------
    // Model Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @param {RoomModel} roomModel
     */
    handleRoomCollectionAdd: function(roomModel) {
        var selectableListItemView = new SelectableListItemView({
            model: roomModel
        });
        var roomNameView = new RoomNameView({
            model: roomModel,
            classes : "text-simple"
        });
        selectableListItemView.addViewChild(roomNameView, '#list-item-' + selectableListItemView.cid);
        this.listView.addViewChild(selectableListItemView);
    }
});
