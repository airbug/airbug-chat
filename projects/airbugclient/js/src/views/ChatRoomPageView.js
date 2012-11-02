//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ChatRoomPageView')

//@Require('ChatListPanelView')
//@Require('ChatRoomTitlePanelView')
//@Require('Class')
//@Require('MustacheView')
//@Require('RoomMemberPanelView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatRoomPageView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div class="row column">' +
                    '<div id="chatroompage-leftrow" class="span3 column"></div>' +
                    '<div id="chatroompage-centerrow" class="span6 column"></div>' +
                    '<div id="chatroompage-rightrow" class="span3 column"></div>' +
                '</div>',


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(options) {

        this._super(options);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------


        // Collections
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChatCollection}
         */
        this.chatCollection = options.chatCollection;

        /**
         * @private
         * @type {RoomMemberCollection}
         */
        this.roomMemberCollection = options.roomMemberCollection;


        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChatModel}
         */
        this.chatModel = options.chatModel;

        /**
         * @private
         * @type {RoomModel}
         */
        this.roomModel = options.roomModel;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChatListPanelView}
         */
        this.chatListPanelView = new ChatListPanelView({
            collection: this.chatCollection
        });

        /**
         * @private
         * @type {ChatRoomTitlePanelView}
         */
        this.chatRoomTitlePanelView = new ChatRoomTitlePanelView({
            model: this.roomModel
        });

        /**
         * @private
         * @type {RoomMemberPanelView}
         */
        this.roomMemberPanelView = new RoomMemberPanelView({
            collection: this.roomMemberCollection
        });
    },


    //-------------------------------------------------------------------------------
    // IDisposable Implementation
    //-------------------------------------------------------------------------------

    /**
     *
     */
    dispose: function() {
        this._super();

    },


    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createViewChildren: function() {
        this.chatListPanelView = new ChatListPanelView({
            collection: this.chatCollection
        });
        this.roomMemberPanelView = new RoomMemberPanelView({
            collection: this.roomMemberCollection
        });
        this.chatRoomTitlePanelView = new ChatRoomTitlePanelView({
            model: this.currentRoom
        });

        this.addViewChild(this.roomMemberPanelView, "#chatroompage-leftrow");
        this.addViewChild(this.chatListPanelView, "#chatroompage-rightrow");
        this.addViewChild(this.chatRoomTitlePanelView, "#chatroompage-centerrow");
    },

    /**
     * @protected
     */
    initializeView: function() {
        this._super();

    }
});
