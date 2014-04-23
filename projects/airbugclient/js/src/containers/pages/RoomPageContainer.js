//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.RoomPageContainer')

//@Require('Class')
//@Require('ClearChange')
//@Require('Exception')
//@Require('RemovePropertyChange')
//@Require('SetPropertyChange')
//@Require('airbug.AccountDropdownButtonContainer')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.CodeEditorOverlayWidgetContainer')
//@Require('airbug.CommandModule')
//@Require('airbug.HomeButtonContainer')
//@Require('airbug.OverlayViewEvent')
//@Require('airbug.PageContainer')
//@Require('airbug.RoomChatBoxContainer')
//@Require('airbug.RoomListPanelContainer')
//@Require('airbug.RoomModel')
//@Require('airbug.ShareRoomContainer')
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('carapace.ModelBuilder')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                               = bugpack.require('Class');
    var ClearChange                         = bugpack.require('ClearChange');
    var Exception                           = bugpack.require('Exception');
    var RemovePropertyChange                = bugpack.require('RemovePropertyChange');
    var SetPropertyChange                   = bugpack.require('SetPropertyChange');
    var AccountDropdownButtonContainer      = bugpack.require('airbug.AccountDropdownButtonContainer');
    var ButtonViewEvent                     = bugpack.require('airbug.ButtonViewEvent');
    var CodeEditorOverlayWidgetContainer    = bugpack.require('airbug.CodeEditorOverlayWidgetContainer');
    var CommandModule                       = bugpack.require('airbug.CommandModule');
    var HomeButtonContainer                 = bugpack.require('airbug.HomeButtonContainer');
    var OverlayViewEvent                    = bugpack.require('airbug.OverlayViewEvent');
    var PageContainer                       = bugpack.require('airbug.PageContainer');
    var RoomChatBoxContainer                = bugpack.require('airbug.RoomChatBoxContainer');
    var RoomListPanelContainer              = bugpack.require('airbug.RoomListPanelContainer');
    var RoomModel                           = bugpack.require('airbug.RoomModel');
    var ShareRoomContainer                  = bugpack.require('airbug.ShareRoomContainer');
    var BugMeta                             = bugpack.require('bugmeta.BugMeta');
    var AutowiredAnnotation                 = bugpack.require('bugioc.AutowiredAnnotation');
    var PropertyAnnotation                  = bugpack.require('bugioc.PropertyAnnotation');
    var ModelBuilder                        = bugpack.require('carapace.ModelBuilder');
    var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired                           = AutowiredAnnotation.autowired;
    var bugmeta                             = BugMeta.context();
    var CommandType                         = CommandModule.CommandType;
    var model                               = ModelBuilder.model;
    var property                            = PropertyAnnotation.property;
    var view                                = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {PageContainer}
     */
    var RoomPageContainer = Class.extend(PageContainer, {

        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {DocumentUtil}
             */
            this.documentUtil                           = null;


            // Containers
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {AccountDropdownButtonContainer}
             */
            this.accountDropdownButtonContainer         = null;

            /**
             * @private
             * @type {ConversationListSlidePanelContainer}
             */
            this.conversationListSlidePanelContainer    = null;

            /**
             * @private
             * @type {HomeButtonContainer}
             */
            this.homeButtonContainer                    = null;

            /**
             * @private
             * @type {RoomChatBoxContainer}
             */
            this.roomChatBoxContainer                   = null;

            /**
             * @private
             * @type {RoomsHamburgerButtonContainer}
             */
            this.roomsHamburgerButtonContainer          = null;

            /**
             * @private
             * @type {ShareRoomContainer}
             */
            this.shareRoomContainer                     = null;


            // Models
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {RoomModel}
             */
            this.roomModel                              = null;


            // Modules
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {CommandModule}
             */
            this.commandModule                          = null;

            /**
             * @private
             * @type {NavigationModule}
             */
            this.navigationModule                       = null;

            /**
             * @private
             * @type {RoomManagerModule}
             */
            this.roomManagerModule                      = null;
        },


        //-------------------------------------------------------------------------------
        // CarapaceContainer Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {Array.<*>} routingArgs
         */
        activateContainer: function(routingArgs) {
            this._super(routingArgs);
            this.loadRoom(this.roomModel.getProperty("id"));
        },

        /**
         * @protected
         */
        createContainer: function(routingArgs) {
            this._super(routingArgs);
            console.log("routingArgs:", routingArgs);

            var roomId = routingArgs[0];

            // Create Models
            //-------------------------------------------------------------------------------

            model(RoomModel)
                .name("roomModel")
                .data({id: roomId})
                .build(this);
        },

        /**
         * @protected
         */
        createContainerChildren: function(routingArgs) {
            this._super(routingArgs);
            this.homeButtonContainer                    = new HomeButtonContainer();
            this.accountDropdownButtonContainer         = new AccountDropdownButtonContainer();
            this.roomChatBoxContainer                   = new RoomChatBoxContainer(this.roomModel);
            this.roomListPanelContainer                 = new RoomListPanelContainer(this.roomModel);

            this.shareRoomContainer                     = new ShareRoomContainer(this.roomModel);
            this.addContainerChild(this.shareRoomContainer,             ".page");


            this.addContainerChild(this.accountDropdownButtonContainer, "#header-right");
            this.addContainerChild(this.homeButtonContainer,            "#header-left");
            this.addContainerChild(this.roomListPanelContainer,         ".column1of4");
            this.addContainerChild(this.roomChatBoxContainer,           ".column2of4");
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();
            var overlayView  = this.shareRoomContainer.getViewTop();
            overlayView.removeEventListener(OverlayViewEvent.EventType.CLOSE, this.hearOverlayCloseEvent, this);

            this.commandModule.unsubscribe(CommandType.DISPLAY.SHARE_ROOM_OVERLAY, this.handleDisplayShareRoomOverlayCommand, this);
            this.commandModule.unsubscribe(CommandType.HIDE.SHARE_ROOM_OVERLAY, this.handleHideShareRoomOverlayCommand, this);
            this.commandModule.unsubscribe(CommandType.DISPLAY.CODE_EDITOR_FULLSCREEN, this.handleDisplayCodeEditorOverlayWidgetCommand, this);
            this.commandModule.unsubscribe(CommandType.HIDE.CODE_EDITOR_FULLSCREEN, this.handleHideCodeEditorOverlayWidgetCommand, this);

            this.roomModel.unobserve(ClearChange.CHANGE_TYPE, "", this.observeRoomNameChange, this);
            this.roomModel.unobserve(SetPropertyChange.CHANGE_TYPE, "name", this.observeRoomNameChange, this);
            this.roomModel.unobserve(RemovePropertyChange.CHANGE_TYPE, "name", this.observeRoomNameChange, this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            var overlayView  = this.shareRoomContainer.getViewTop();
            overlayView.addEventListener(OverlayViewEvent.EventType.CLOSE, this.hearOverlayCloseEvent, this);

            this.commandModule.subscribe(CommandType.DISPLAY.SHARE_ROOM_OVERLAY, this.handleDisplayShareRoomOverlayCommand, this);
            this.commandModule.subscribe(CommandType.HIDE.SHARE_ROOM_OVERLAY, this.handleHideShareRoomOverlayCommand, this);
            this.commandModule.subscribe(CommandType.DISPLAY.CODE_EDITOR_FULLSCREEN, this.handleDisplayCodeEditorOverlayWidgetCommand, this);
            this.commandModule.subscribe(CommandType.HIDE.CODE_EDITOR_FULLSCREEN, this.handleHideCodeEditorOverlayWidgetCommand, this);

            this.roomModel.observe(ClearChange.CHANGE_TYPE, "", this.observeRoomNameChange, this);
            this.roomModel.observe(SetPropertyChange.CHANGE_TYPE, "name", this.observeRoomNameChange, this);
            this.roomModel.observe(RemovePropertyChange.CHANGE_TYPE, "name", this.observeRoomNameChange, this);
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {string} roomId
         */
        loadRoom: function(roomId) {
            var _this = this;
            this.roomManagerModule.retrieveRoom(roomId, function(throwable, roomMeldDocument) {
                if (!throwable) {
                    _this.roomModel.setMeldDocument(roomMeldDocument);
                } else {

                    //TODO BRN: Need to introduce some sort of error handling system that can take any error and figure out what to do with it and what to show the user

                    if (Class.doesExtend(throwable, Exception)) {
                        _this.commandModule.relayCommand(CommandType.FLASH.EXCEPTION, {message: throwable.getMessage()});
                        setTimeout(function() {
                            _this.navigationModule.navigate("home", {trigger: true});
                        }, 1500);
                    } else {
                        _this.commandModule.relayCommand(CommandType.FLASH.ERROR, {message: "Sorry an error has occurred" + throwable});
                        setTimeout(function() {
                            _this.navigationModule.navigate("home", {trigger: true});
                        }, 1500);
                    }
                }
            });
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        hideShareRoomOverlay: function() {
            this.viewTop.$el.find(".share-room-overlay").hide();
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Event} event
         */
        hearOverlayCloseEvent: function(event) {
            this.hideShareRoomOverlay();
        },


        //-------------------------------------------------------------------------------
        // Message Handlers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {PublisherMessage} message
         */
        handleDisplayCodeEditorOverlayWidgetCommand: function(message) {
            console.log("handleDisplayCodeEditorOverlayWidgetCommand");
            var data            = message.getData();
            var cursorPosition  = data.cursorPosition;
            var showInvisibles  = data.showInvisibles;
            var tabSize         = data.tabSize;
            var text            = data.text;
            var mode            = data.mode;
            var theme           = data.theme;

            console.log("data:", data);
            if(!this.codeEditorOverlayWidgetContainer){
                this.codeEditorOverlayWidgetContainer = new CodeEditorOverlayWidgetContainer();
            }
            this.addContainerChild(this.codeEditorOverlayWidgetContainer, ".page");
            this.codeEditorOverlayWidgetContainer.setEditorText(text);
            this.codeEditorOverlayWidgetContainer.setEditorMode(mode);
            this.codeEditorOverlayWidgetContainer.setEditorShowInvisibles(showInvisibles);
            this.codeEditorOverlayWidgetContainer.setEditorTheme(theme);
            this.codeEditorOverlayWidgetContainer.setEditorTabSize(tabSize);
            this.codeEditorOverlayWidgetContainer.setEditorCursorPosition(cursorPosition);
            this.codeEditorOverlayWidgetContainer.getViewTop().show();
            this.codeEditorOverlayWidgetContainer.focusEditor();
        },

        /**
         * @private
         * @param {Message} message
         */
        handleDisplayShareRoomOverlayCommand: function(message) {
            this.viewTop.$el.find(".share-room-overlay").show();
        },

        /**
         * @private
         * @param {PublisherMessage} message
         */
        handleHideCodeEditorOverlayWidgetCommand: function(message) {
            var text    = this.codeEditorOverlayWidgetContainer.getEditorText();
            var mode    = this.codeEditorOverlayWidgetContainer.getEditorMode();
            var theme   = this.codeEditorOverlayWidgetContainer.getEditorTheme();
            var tabSize = this.codeEditorOverlayWidgetContainer.getEditorTabSize();
            this.commandModule.relayCommand(CommandType.CODE_EDITOR.SET_TEXT,       {text: text});
            this.commandModule.relayCommand(CommandType.CODE_EDITOR.SET_MODE,       {mode: mode});
            this.commandModule.relayCommand(CommandType.CODE_EDITOR.SET_THEME,      {theme: theme});
            this.commandModule.relayCommand(CommandType.CODE_EDITOR.SET_TABSIZE,    {tabSize: tabSize});
            this.codeEditorOverlayWidgetContainer.getViewTop().hide();
            this.removeContainerChild(this.codeEditorOverlayWidgetContainer);
        },
        /**
         * @private
         * @param {Message} message
         */
        handleHideShareRoomOverlayCommand: function(message) {
            this.hideShareRoomOverlay();
        },


        //-------------------------------------------------------------------------------
        // Model Observers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Observation} observation
         */
        observeRoomNameChange: function(observation) {
            this.documentUtil.setTitle(this.roomModel.getProperty("name"));
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(RoomPageContainer).with(
        autowired().properties([
            property("commandModule").ref("commandModule"),
            property("documentUtil").ref("documentUtil"),
            property("navigationModule").ref("navigationModule"),
            property("roomManagerModule").ref("roomManagerModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.RoomPageContainer", RoomPageContainer);
});
