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
//@Require('ViewBuilder')


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view = ViewBuilder.view;


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

        this.roomCollection = new RoomCollection([], "roomCollection");
        this.addCollection(this.roomCollection);


        // Create Views
        //-------------------------------------------------------------------------------

        this.panelView =
        view(PanelWithHeaderView)
            .attributes({headerTitle: "Rooms"})
            .children([
                view(ButtonView)
                    .attributes({size: ButtonView.Size.SMALL})
                    .id("addRoomButtonView")
                    .appendTo('*[id|="panel-header-nav"]')
                    .children([
                        view(TextView)
                            .attributes({text: "+"})
                            .appendTo('*[id|="button"]')
                    ]),
                view(ListView)
                    .id("listView")
                    .appendTo('*[id|="panel-body"]')
            ])
            .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.panelView);
        this.addRoomButtonView = this.findViewById("addRoomButtonView");
        this.listView = this.findViewById("listView");
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.roomCollection.bind('add', this.handleRoomCollectionAdd, this);
        this.listView.addEventListener(ListViewEvent.EventTypes.ITEM_SELECTED, this.hearListViewItemSelectedEvent, this);
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
