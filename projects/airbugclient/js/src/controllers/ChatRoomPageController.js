//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ChatRoomPageController')

//@Require('AccountButtonView')
//@Require('Annotate')
//@Require('AnnotateRoute')
//@Require('ApplicationView')
//@Require('CarapaceController')
//@Require('ChatPanelEvent')
//@Require('ChatRoomPageView')
//@Require('Class')
//@Require('ChatCollection')
//@Require('ChatPanelEvent')
//@Require('ChatPanelView')
//@Require('HeaderView')
//@Require('HomeButtonEvent')
//@Require('HomeButtonView')
//@Require('RoomMemberCollection')
//@Require('RoomMemberPanelEvent')
//@Require('RoomMemberPanelView')


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate = Annotate.annotate;
var annotation = Annotate.annotation;
var route = AnnotateRoute.route;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatRoomPageController = Class.extend(CarapaceController, {

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
     * @protected
     */
    activate: function() {
        this._super();

        var chatCollection = new ChatCollection();
        var roomMemberCollection = new RoomMemberCollection();

        var applicationView = new ApplicationView();
        var chatPanelView = new ChatPanelView({
            collection: chatCollection
        });
        var roomMemberPanelView = new RoomMemberPanelView({
           collection: roomMemberCollection
        });
        var headerView = new HeaderView();
        var chatRoomPageView = new ChatRoomPageView();
        var homeButtonView = new HomeButtonView();
        var accountButtonView = new AccountButtonView();

        chatPanelView.addEventListener(ChatPanelEvent.EventTypes.CHAT_SELECTED, this.hearChatSelectedEvent, this);
        homeButtonView.addEventListener(HomeButtonEvent.EventTypes.CLICKED, this.hearHomeButtonClickedEvent, this);
        roomMemberPanelView.addEventListener(RoomMemberPanelEvent.EventTypes.ROOM_MEMBER_SELECTED, this.hearRoomMemberSelected, this);

        headerView.addViewChild(homeButtonView, '#header-left');
        headerView.addViewChild(accountButtonView, '#header-right');
        chatRoomPageView.addViewChild(roomMemberPanelView, "#chatroompage-leftrow");
        chatRoomPageView.addViewChild(chatPanelView, "#chatroompage-rightrow");
        applicationView.addViewChild(chatRoomPageView, "#application");

        this.addView(headerView);
        this.addView(applicationView);

        roomMemberCollection.add(new RoomMemberModel({uid: "nv40pfs", firstName: "Brian", lastName: "Neisler", status: "available"}));
        roomMemberCollection.add(new RoomMemberModel({uid: "amvp06d", firstName: "Adam", lastName: "Nisenbaum", status: "dnd"}));

        chatCollection.add(new ChatModel({
            uid: "1aRtls0",
            name: "Tim Pote",
            unreadMessageCount: 4,
            unreadMessagePreview: "Hey bro!",
            context: {
                type: "contact",
                uid: "aN9o234"
            }
        }));
        chatCollection.add(new ChatModel({
            uid: "bn6LPsd",
            name: "airbug Company Room",
            unreadMessageCount: 20,
            unreadMessagePreview:"Brian: We have our first customer! Also, this is a really long message that should eventually overflow the preview because i just kept typing and typing and typing and typing and typing and typing and typing and typing and typing...",
            context: {
                type: "room",
                uid: "g13Dl0s"
            }
        }));
        chatCollection.add(new ChatModel({
            uid: "PLn865D",
            name: "airbug Dev Room",
            unreadMessageCount: 105,
            unreadMessagePreview: "Brian: Can someone checkout bug air-542?",
            context: {
                type: "room",
                uid: "nb0psdf"
            }
        }));

        this.addModel(roomMemberCollection);
        this.addModel(chatCollection);
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    routeChatRoomPage: function(uid) {
        console.log("routed to chat room - uid:" + uid);
        // TODO BRN: Load the members associated with this room and add the to the roomMemberPanel
        // TODO BRN: Load the chat associated with this room and add it to the chatPanel
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {ChatPanelEvent} event
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
     * @param {Event} event
     */
    hearHomeButtonClickedEvent: function(event) {
        this.navigate("", {trigger: true});
    },

    /**
     * @private
     * @param {Event} event
     */
    hearRoomMemberSelected: function(event) {
        var roomMember = event.getData();
        this.navigate("contact/" + roomMember.uid, {trigger: true});
    }
});
annotate(ChatRoomPageController).with(
    annotation("Controller").params(
        route("room/:uid").to(ChatRoomPageController.prototype.routeChatRoomPage)
    )
);
