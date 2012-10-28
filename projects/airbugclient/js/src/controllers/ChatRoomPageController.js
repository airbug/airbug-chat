//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ChatRoomPageController')

//@Require('AccountButtonView')
//@Require('Annotate')
//@Require('AnnotateRoute')
//@Require('ApplicationView')
//@Require('CarapaceController')
//@Require('ChatRoomPageView')
//@Require('Class')
//@Require('ChatCollection')
//@Require('ChatPanelEvent')
//@Require('ChatPanelView')
//@Require('HeaderView')
//@Require('HomeButtonEvent')
//@Require('HomeButtonView')
//@Require('RoomMemberCollection')


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

        var applicationView = new ApplicationView();
        var chatPanelView = new ChatPanelView({
            collection: chatCollection
        });
        var headerView = new HeaderView();
        var chatRoomPageView = new ChatRoomPageView();
        var homeButtonView = new HomeButtonView();
        var accountButtonView = new AccountButtonView();

        homeButtonView.addEventListener(HomeButtonEvent.EventTypes.CLICKED, this.hearHomeButtonClickedEvent, this);

        headerView.addViewChild(homeButtonView, '#header-left');
        headerView.addViewChild(accountButtonView, '#header-right');
        chatRoomPageView.addViewChild(chatPanelView, "#chatroompage-rightrow");
        applicationView.addViewChild(chatRoomPageView, "#application");

        this.addView(headerView);
        this.addView(applicationView);

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
     * @param {Event} event
     */
    hearHomeButtonClickedEvent: function(event) {
        this.navigate("", {trigger: true});
    }
});
annotate(ChatRoomPageController).with(
    annotation("Controller").params(
        route("room/:uid").to(ChatRoomPageController.prototype.routeChatRoomPage)
    )
);
