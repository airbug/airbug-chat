//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('UserHomePageController')

//@Require('AccountButtonView')
//@Require('Annotate')
//@Require('AnnotateRoute')
//@Require('ApplicationView')
//@Require('CarapaceController')
//@Require('Class')
//@Require('ContactCollection')
//@Require('ContactPanelEvent')
//@Require('ContactPanelView')
//@Require('ChatCollection')
//@Require('ChatListPanelEvent')
//@Require('ChatListPanelView')
//@Require('HeaderView')
//@Require('RoomCollection')
//@Require('RoomPanelEvent')
//@Require('RoomPanelView')
//@Require('UserHomePageView')


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate = Annotate.annotate;
var annotation = Annotate.annotation;
var route = AnnotateRoute.route;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserHomePageController = Class.extend(CarapaceController, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(router) {

        this._super(router);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ContactCollection}
         */
        this.contactCollection = null;

        /**
         * @protected
         * @type {ChatCollection}
         */
        this.chatCollection = null;

        /**
         * @protected
         * @type {RoomCollection}
         */
        this.roomCollection = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    activate: function() {
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------

        this.contactCollection = new ContactCollection();
        this.chatCollection = new ChatCollection();
        this.roomCollection = new RoomCollection();

        this.addModel(this.contactCollection);
        this.addModel(this.chatCollection);
        this.addModel(this.roomCollection);


        // Create Views
        //-------------------------------------------------------------------------------

        var applicationView = new ApplicationView();
        var headerView = new HeaderView();
        var contactPanelView = new ContactPanelView({
            collection: this.contactCollection
        });
        var chatPanelView = new ChatListPanelView({
            collection: this.chatCollection
        });
        var roomPanelView = new RoomPanelView({
            collection: this.roomCollection
        });
        var userHomePageView = new UserHomePageView();
        var accountButtonView = new AccountButtonView();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        headerView.addViewChild(accountButtonView, '#header-right');
        userHomePageView.addViewChild(contactPanelView, "#userhomepage-leftrow");
        userHomePageView.addViewChild(chatPanelView, "#userhomepage-centerrow");
        userHomePageView.addViewChild(roomPanelView, "#userhomepage-rightrow");
        applicationView.addViewChild(userHomePageView, "#application");


        // Initialize View Listeners
        //-------------------------------------------------------------------------------

        chatPanelView.addEventListener(ChatListPanelEvent.EventTypes.CHAT_SELECTED, this.hearChatSelectedEvent, this);
        contactPanelView.addEventListener(ContactPanelEvent.EventTypes.CONTACT_SELECTED, this.hearContactSelectedEvent, this);
        roomPanelView.addEventListener(RoomPanelEvent.EventTypes.ROOM_SELECTED, this.hearRoomSelectedEvent, this);


        // Start the Views
        //-------------------------------------------------------------------------------

        this.addView(headerView);
        this.addView(applicationView);
    },

    /**
     * @protected
     */
    deactivate: function() {
        this._super();
        this.contactCollection = null;
        this.chatCollection = null;
        this.roomCollection = null;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    routeUserHome: function() {
        //TODO BRN:

        //TEST
        this.contactCollection.add(new ContactModel({uid: "aN9o234", firstName: "Tim", lastName: "Pote", status: "away"}));
        this.contactCollection.add(new ContactModel({uid: "nv40pfs", firstName: "Brian", lastName: "Neisler", status: "available"}));
        this.contactCollection.add(new ContactModel({uid: "amvp06d", firstName: "Adam", lastName: "Nisenbaum", status: "dnd"}));
        this.contactCollection.add(new ContactModel({uid: "djGh4DA", firstName: "Tom", lastName: "Raic", status: "offline"}));

        this.chatCollection.add(new ChatModel({
            uid: "1aRtls0",
            name: "Tim Pote",
            unreadMessageCount: 4,
            unreadMessagePreview: "Hey bro!",
            context: {
                type: "contact",
                uid: "aN9o234"
            }
        }));
        this.chatCollection.add(new ChatModel({
            uid: "bn6LPsd",
            name: "airbug Company Room",
            unreadMessageCount: 20,
            unreadMessagePreview:"Brian: We have our first customer! Also, this is a really long message that should eventually overflow the preview because i just kept typing and typing and typing and typing and typing and typing and typing and typing and typing...",
            context: {
                type: "room",
                uid: "g13Dl0s"
            }
        }));
        this.chatCollection.add(new ChatModel({
            uid: "PLn865D",
            name: "airbug Dev Room",
            unreadMessageCount: 105,
            unreadMessagePreview: "Brian: Can someone checkout bug air-542?",
            context: {
                type: "room",
                uid: "nb0psdf"
            }
        }));

        this.roomCollection.add(new RoomModel({uid: "g13Dl0s", name: "airbug Company Room"}));
        this.roomCollection.add(new RoomModel({uid: "nb0psdf", name: "airbug Dev Room"}));
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {ContactPanelEvent} event
     */
    hearContactSelectedEvent: function(event) {
        var contact = event.getData();
        this.navigate("contact/" + contact.uid, {trigger: true});
    },

    /**
     * @private
     * @param {ChatListPanelEvent} event
     */
    hearChatSelectedEvent: function(event) {
        var chat = event.getData();
        var context = chat.context;
        if (context.type === "contact") {
            this.navigate("contact/" + context.uid, {trigger: true});
        } else if (context.type === "room") {
            this.navigate("room/" + context.uid, {trigger: true});
        } else {
            throw new Error("unrecognized chat context type");
        }
    },

    /**
     * @private
     * @param {RoomPanelEvent} event
     */
    hearRoomSelectedEvent: function(event) {
        var room = event.getData();
        this.navigate("room/" + room.uid, {trigger: true});
    }
});
annotate(UserHomePageController).with(
    annotation("Controller").params(
        route("").to(UserHomePageController.prototype.routeUserHome)
    )
);
