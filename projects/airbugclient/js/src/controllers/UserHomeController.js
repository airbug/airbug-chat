//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('UserHomeController')

//@Require('Annotate')
//@Require('AnnotateRoute')
//@Require('ApplicationView')
//@Require('CarapaceController')
//@Require('Class')
//@Require('ContactCollection')
//@Require('ContactPanelEvent')
//@Require('ContactPanelView')
//@Require('ConversationCollection')
//@Require('ConversationPanelEvent')
//@Require('ConversationPanelView')
//@Require('HeaderView')
//@Require('RoomCollection')
//@Require('RoomPanelEvent')
//@Require('RoomPanelView')
//@Require('UserHomePageNavView')
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

var UserHomeController = Class.extend(CarapaceController, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(router) {

        this._super(router);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Implementation
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    activate: function() {
        this._super();

        var contactCollection = new ContactCollection();
        var conversationCollection = new ConversationCollection();
        var roomCollection = new RoomCollection();

        var applicationView = new ApplicationView();
        var contactPanelView = new ContactPanelView({
            collection: contactCollection
        });
        var conversationPanelView = new ConversationPanelView({
            collection: conversationCollection
        });
        var roomPanelView = new RoomPanelView({
            collection: roomCollection
        });
        var headerView = new HeaderView();
        var userHomePageView = new UserHomePageView();
        var userHomePageNavView = new UserHomePageNavView();

        contactPanelView.addEventListener(ContactPanelEvent.EventTypes.CONTACT_SELECTED, this.hearContactSelectedEvent, this);
        conversationPanelView.addEventListener(ConversationPanelEvent.EventTypes.CONVERSATION_SELECTED, this.hearConversationSelectedEvent, this);
        roomPanelView.addEventListener(RoomPanelEvent.EventTypes.ROOM_SELECTED, this.hearRoomSelectedEvent, this);

        headerView.addViewChild(userHomePageNavView, '#header-right');
        userHomePageView.addViewChild(contactPanelView, "#leftrow");
        userHomePageView.addViewChild(conversationPanelView, "#centerrow");
        userHomePageView.addViewChild(roomPanelView, "#rightrow");
        applicationView.addViewChild(userHomePageView, "#application");

        this.addView(headerView);
        this.addView(applicationView);


        //TEST
        contactCollection.add(new ContactModel({uid: "aN9o234", firstName: "Tim", lastName: "Pote", status: "away"}));
        contactCollection.add(new ContactModel({uid: "nv40pfs", firstName: "Brian", lastName: "Neisler", status: "available"}));
        contactCollection.add(new ContactModel({uid: "amvp06d", firstName: "Adam", lastName: "Nisenbaum", status: "dnd"}));
        contactCollection.add(new ContactModel({uid: "djGh4DA", firstName: "Tom", lastName: "Raic", status: "offline"}));

        conversationCollection.add(new ConversationModel({
            uid: "1aRtls0",
            name: "Tim Pote",
            unreadMessageCount: 4,
            unreadMessagePreview: "Hey bro!",
            context: {
                type: "contact",
                uid: "aN9o234"
            }
        }));
        conversationCollection.add(new ConversationModel({
            uid: "bn6LPsd",
            name: "airbug Company Room",
            unreadMessageCount: 20,
            unreadMessagePreview:"Brian: We have our first customer! Also, this is a really long message that should eventually overflow the preview because i just kept typing and typing and typing and typing and typing and typing and typing and typing and typing...",
            context: {
                type: "room",
                uid: "g13Dl0s"
            }
        }));
        conversationCollection.add(new ConversationModel({
            uid: "PLn865D",
            name: "airbug Dev Room",
            unreadMessageCount: 105,
            unreadMessagePreview: "Brian: Can someone checkout bug air-542?",
            context: {
                type: "room",
                uid: "nb0psdf"
            }
        }));

        roomCollection.add(new RoomModel({uid: "g13Dl0s", name: "airbug Company Room"}));
        roomCollection.add(new RoomModel({uid: "nb0psdf", name: "airbug Dev Room"}));

        this.addModel(contactCollection);
        this.addModel(conversationCollection);
        this.addModel(roomCollection);
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    routeUserHome: function() {
        // Is there anything we need to do here?
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
     * @param {ConversationPanelEvent} event
     */
    hearConversationSelectedEvent: function(event) {
        var conversation = event.getData();
        var context = conversation.context;
        if (context.type === "contact") {
            this.navigate("contact/" + context.uid, {trigger: true});
        } else if (context.type === "room") {
            this.navigate("room/" + context.uid, {trigger: true});
        } else {
            throw new Error("unrecognized conversation context type");
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
annotate(UserHomeController).with(
    annotation("Controller").params(
        route("").to(UserHomeController.prototype.routeUserHome)
    )
);
