//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ChatRoomPageContainer')

//@Require('ApplicationContainer')
//@Require('ChatModel')
//@Require('Class')
//@Require('ConversationListPanelContainer')
//@Require('RoomMemberListPanelContainer')
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

        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AccountButtonContainer}
         */
        this.accountButtonContainer = null;

        /**
         * @private
         * @type {ConversationListPanelContainer}
         */
        this.conversationListPanelContainer = null;

        /**
         * @private
         * @type {RoomMemberListPanelContainer}
         */
        this.roomMemberListPanelContainer = null;


        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {RoomModel}
         */
        this.roomModel = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @type {PageThreeColumnView}
         */
        this.pageThreeColumnView = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<*>} routerArgs
     */
    activateContainer: function(routerArgs) {
        this._super(routerArgs);
        // TODO BRN: Load the room associated with the passed in uid.
        // TODO BRN: Load the members associated with this room and add the to the roomMemberPanel
        // TODO BRN: Load the chat associated with this room and add it to the chatPanel
        var roomUuid = routerArgs[0];

        this.loadCurrentRoom(roomUuid);
    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------

        this.roomModel = new RoomModel();
        this.addModel(this.roomModel);


        // Create Views
        //-------------------------------------------------------------------------------

        this.pageThreeColumnView = new PageThreeColumnView();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.applicationView.addViewChild(this.pageThreeColumnView, "#application-" + this.applicationView.cid);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.accountButtonContainer = new AccountButtonContainer(this.apiPublisher);
        this.conversationListPanelContainer = new ConversationListPanelContainer(this.apiPublisher);
        this.roomMemberListPanelContainer = new RoomMemberListPanelContainer(this.apiPublisher, this.roomModel);
        this.addContainerChild(this.accountButtonContainer, '#header-right');
        this.addContainerChild(this.conversationListPanelContainer, "#page-rightrow");
        this.addContainerChild(this.roomMemberListPanelContainer, "#page-leftrow");
    },

    /**
     * @protected
     */
    deactivateContainer: function() {
        this._super();
        this.roomModel = null;
    },


    //-------------------------------------------------------------------------------
    // Protected Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {string} uuid
     */
    loadCurrentRoom: function(uuid) {
        this.roomModel.set("uuid", uuid);

        //TODO BRN: This is where we will begin to sync this value.
        // this.roomModel.fetch({
        //      success: function(model, response) {
        //      },
        //      error: function(model, response) {
        //      }
        // });

        //TEST
        /*if (uid === "g13Dl0s") {
            this.roomModel = new RoomModel({uuid: "g13Dl0s", name: "airbug Company Room"});
            this.chatModel = new ChatModel({
                uuid: "bn6LPsd",
                name: "airbug Company Room",
                unreadMessageCount: 20,
                unreadMessagePreview:"Brian: We have our first customer! Also, this is a really long message that should eventually overflow the preview because i just kept typing and typing and typing and typing and typing and typing and typing and typing and typing...",
                context: {
                    type: "room",
                    uuid: "g13Dl0s"
                }
            });
            this.roomMemberCollection.add(new RoomMemberModel({uuid: "aN9o234", firstName: "Tim", lastName: "Pote", status: "away"}));
            this.roomMemberCollection.add(new RoomMemberModel({uuid: "nv40pfs", firstName: "Brian", lastName: "Neisler", status: "available"}));
            this.roomMemberCollection.add(new RoomMemberModel({uuid: "amvp06d", firstName: "Adam", lastName: "Nisenbaum", status: "dnd"}));
            this.roomMemberCollection.add(new RoomMemberModel({uuid: "djGh4DA", firstName: "Tom", lastName: "Raic", status: "offline"}));
        } else if (uid === "nb0psdf") {
            this.roomModel = new RoomModel({uuid: "nb0psdf", name: "airbug Dev Room"});
            this.chatModel = new ChatModel({
                uuid: "PLn865D",
                name: "airbug Dev Room",
                unreadMessageCount: 105,
                unreadMessagePreview: "Brian: Can someone checkout bug air-542?",
                context: {
                    type: "room",
                    uuid: "nb0psdf"
                }
            });
            this.roomMemberCollection.add(new RoomMemberModel({uuid: "nv40pfs", firstName: "Brian", lastName: "Neisler", status: "available"}));
            this.roomMemberCollection.add(new RoomMemberModel({uuid: "amvp06d", firstName: "Adam", lastName: "Nisenbaum", status: "dnd"}));
            this.roomMemberCollection.add(new RoomMemberModel({uuid: "djGh4DA", firstName: "Tom", lastName: "Raic", status: "offline"}));
        }

        this.chatCollection.add(new ChatModel({
            uuid: "1aRtls0",
            name: "Tim Pote",
            unreadMessageCount: 4,
            unreadMessagePreview: "Hey bro!",
            context: {
                type: "contact",
                uuid: "aN9o234"
            }
        }));
        this.chatCollection.add(new ChatModel({
            uuid: "bn6LPsd",
            name: "airbug Company Room",
            unreadMessageCount: 20,
            unreadMessagePreview:"Brian: We have our first customer! Also, this is a really long message that should eventually overflow the preview because i just kept typing and typing and typing and typing and typing and typing and typing and typing and typing...",
            context: {
                type: "room",
                uuid: "g13Dl0s"
            }
        }));
        this.chatCollection.add(new ChatModel({
            uuid: "PLn865D",
            name: "airbug Dev Room",
            unreadMessageCount: 105,
            unreadMessagePreview: "Brian: Can someone checkout bug air-542?",
            context: {
                type: "room",
                uuid: "nb0psdf"
            }
        }));*/
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
