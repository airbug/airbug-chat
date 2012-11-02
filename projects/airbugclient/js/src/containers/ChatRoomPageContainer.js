//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ChatRoomPageContainer')

//@Require('AccountButtonView')
//@Require('Annotate')
//@Require('AnnotateRoute')
//@Require('ApplicationContainer')
//@Require('ApplicationView')
//@Require('ButtonViewEvent')
//@Require('ChatModel')
//@Require('ChatRoomPageView')
//@Require('Class')
//@Require('ChatCollection')
//@Require('ChatListPanelView')
//@Require('HeaderView')
//@Require('HomeButtonView')
//@Require('ListViewEvent')
//@Require('RoomMemberCollection')
//@Require('RoomMemberPanelEvent')
//@Require('RoomMemberPanelView')
//@Require('RoomModel')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatRoomPageContainer = Class.extend(ApplicationContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(apiPublisher) {

        this._super(apiPublisher);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Collections
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChatCollection}
         */
        this.chatCollection = null;

        /**
         * @private
         * @type {RoomMemberCollection}
         */
        this.roomMemberCollection = null;


        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChatModel}
         */
        this.chatModel = null;

        /**
         * @private
         * @type {RoomModel}
         */
        this.roomModel = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function() {
        this._super();

        // Create Models
        //-------------------------------------------------------------------------------

        this.chatCollection = new ChatCollection();
        this.chatModel = new ChatModel();
        this.roomMemberCollection = new RoomMemberCollection();
        this.roomModel = new RoomModel();

        this.addModel(this.chatCollection);
        this.addModel(this.chatModel);
        this.addModel(this.roomMemberCollection);
        this.addModel(this.roomModel);


        // Create Views
        //-------------------------------------------------------------------------------


        /*var chatRoomPageView = new ChatRoomPageView({
            chatCollection: this.chatCollection,
            chatModel: this.chatModel,
            roomMemberCollection: this.roomMemberCollection,
            roomModel: this.roomModel
        });
        var homeButtonView = new HomeButtonView();



        // Wire Up Views
        //-------------------------------------------------------------------------------

        headerView.addViewChild(homeButtonView, '#header-left');
        headerView.addViewChild(accountButtonView, '#header-right');
        applicationView.addViewChild(chatRoomPageView, "#application");


        // Initialize View Listeners
        //-------------------------------------------------------------------------------

        chatRoomPageView.addEventListener(ChatListPanelEvent.EventTypes.CHAT_SELECTED, this.hearChatSelectedEvent, this);
        chatRoomPageView.addEventListener(RoomMemberPanelEvent.EventTypes.ROOM_MEMBER_SELECTED, this.hearRoomMemberSelected, this);
        homeButtonView.addEventListener(ButtonViewEvent.EventTypes.CLICKED, this.hearHomeButtonClickedEvent, this);


        // Start the Views
        //-------------------------------------------------------------------------------

        this.addView(headerView);
        this.addView(applicationView);  */
    },

    /**
     * @protected
     */
    deactivateContainer: function() {
        this._super();
        this.chatCollection = null;
        this.chatModel = null;
        this.roomMemberCollection = null;
        this.roomModel = null;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    activateContainer: function(uid) {
        // TODO BRN: Load the room associated with the passed in uid.
        // TODO BRN: Load the members associated with this room and add the to the roomMemberPanel
        // TODO BRN: Load the chat associated with this room and add it to the chatPanel


        //this.loadCurrentRoom(uid);
    },


    //-------------------------------------------------------------------------------
    // Protected Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {string} uid
     */
    loadCurrentRoom: function(uid) {
        this.roomModel.set("uid", uid);

        //TODO BRN: This is where we will begin to sync this value.
        // this.roomModel.fetch({
        //      success: function(model, response) {
        //      },
        //      error: function(model, response) {
        //      }
        // });

        //TEST
        if (uid === "g13Dl0s") {
            this.roomModel = new RoomModel({uid: "g13Dl0s", name: "airbug Company Room"});
            this.chatModel = new ChatModel({
                uid: "bn6LPsd",
                name: "airbug Company Room",
                unreadMessageCount: 20,
                unreadMessagePreview:"Brian: We have our first customer! Also, this is a really long message that should eventually overflow the preview because i just kept typing and typing and typing and typing and typing and typing and typing and typing and typing...",
                context: {
                    type: "room",
                    uid: "g13Dl0s"
                }
            });
            this.roomMemberCollection.add(new RoomMemberModel({uid: "aN9o234", firstName: "Tim", lastName: "Pote", status: "away"}));
            this.roomMemberCollection.add(new RoomMemberModel({uid: "nv40pfs", firstName: "Brian", lastName: "Neisler", status: "available"}));
            this.roomMemberCollection.add(new RoomMemberModel({uid: "amvp06d", firstName: "Adam", lastName: "Nisenbaum", status: "dnd"}));
            this.roomMemberCollection.add(new RoomMemberModel({uid: "djGh4DA", firstName: "Tom", lastName: "Raic", status: "offline"}));
        } else if (uid === "nb0psdf") {
            this.roomModel = new RoomModel({uid: "nb0psdf", name: "airbug Dev Room"});
            this.chatModel = new ChatModel({
                uid: "PLn865D",
                name: "airbug Dev Room",
                unreadMessageCount: 105,
                unreadMessagePreview: "Brian: Can someone checkout bug air-542?",
                context: {
                    type: "room",
                    uid: "nb0psdf"
                }
            });
            this.roomMemberCollection.add(new RoomMemberModel({uid: "nv40pfs", firstName: "Brian", lastName: "Neisler", status: "available"}));
            this.roomMemberCollection.add(new RoomMemberModel({uid: "amvp06d", firstName: "Adam", lastName: "Nisenbaum", status: "dnd"}));
            this.roomMemberCollection.add(new RoomMemberModel({uid: "djGh4DA", firstName: "Tom", lastName: "Raic", status: "offline"}));
        }

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
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

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
