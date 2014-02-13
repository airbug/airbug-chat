//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RoomPageContainer')

//@Require('Class')
//@Require('Exception')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.CodeEditorOverlayWidgetContainer')
//@Require('airbug.CommandModule')
//@Require('airbug.HomeButtonContainer')
//@Require('airbug.LogoutButtonContainer')
//@Require('airbug.PageContainer')
//@Require('airbug.RoomChatBoxContainer')
//@Require('airbug.RoomListPanelContainer')
//@Require('airbug.RoomModel')
//@Require('airbug.ShareRoomContainer')
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                               = bugpack.require('Class');
var Exception                           = bugpack.require('Exception');
var ButtonViewEvent                     = bugpack.require('airbug.ButtonViewEvent');
var CodeEditorOverlayWidgetContainer    = bugpack.require('airbug.CodeEditorOverlayWidgetContainer');
var CommandModule                       = bugpack.require('airbug.CommandModule');
var HomeButtonContainer                 = bugpack.require('airbug.HomeButtonContainer');
var LogoutButtonContainer               = bugpack.require('airbug.LogoutButtonContainer');
var PageContainer                       = bugpack.require('airbug.PageContainer');
var RoomChatBoxContainer                = bugpack.require('airbug.RoomChatBoxContainer');
var RoomListPanelContainer              = bugpack.require('airbug.RoomListPanelContainer');
var RoomModel                           = bugpack.require('airbug.RoomModel');
var ShareRoomContainer                  = bugpack.require('airbug.ShareRoomContainer');
var BugMeta                             = bugpack.require('bugmeta.BugMeta');
var AutowiredAnnotation                 = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation                  = bugpack.require('bugioc.PropertyAnnotation');
var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired                   = AutowiredAnnotation.autowired;
var bugmeta                     = BugMeta.context();
var CommandType                 = CommandModule.CommandType;
var property                    = PropertyAnnotation.property;
var view                        = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomPageContainer = Class.extend(PageContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

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
         * @type {LogoutButtonContainer}
         */
        this.logoutButtonContainer                  = null;

        /**
         * @private
         * @type {RoomChatBoxContainer}
         */
        this.roomChatBoxContainer                   = null;

        /**
         * @private
         * @type {RoomMemberListPanelContainer}
         */
        this.roomMemberListPanelContainer           = null;

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


        // Views
        //-------------------------------------------------------------------------------


        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @type {CommandModule}
         */
        this.commandModule                          = null;

        /**
         * @type {NavigationModule}
         */
        this.navigationModule                       = null;

        /**
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
        this.documentUtil.setTitle(this.roomModel.getProperty("name"));
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

        this.roomModel = this.roomManagerModule.generateRoomModel({id: roomId});
    },

    /**
     * @protected
     */
    createContainerChildren: function(routingArgs) {
        this._super(routingArgs);
        this.homeButtonContainer                    = new HomeButtonContainer();
        this.logoutButtonContainer                  = new LogoutButtonContainer();
        this.roomChatBoxContainer                   = new RoomChatBoxContainer(this.roomModel);
        this.roomListPanelContainer                 = new RoomListPanelContainer();

        this.shareRoomContainer                     = new ShareRoomContainer(this.roomModel);
        this.addContainerChild(this.shareRoomContainer,             ".page");


        this.addContainerChild(this.logoutButtonContainer,          "#header-right");
        this.addContainerChild(this.homeButtonContainer,            "#header-left");
        this.addContainerChild(this.roomListPanelContainer,         ".column1of4");
        this.addContainerChild(this.roomChatBoxContainer,           ".column2of4");
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        //EventListeners and and command subscription initialization handled by super
    },

    /**
     * @protected
     */
    deinitializeContainer: function() {
        this._super();
        //EventListeners and and command subscription deinitialization handled by super
    },


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    initializeEventListeners: function() {
        this._super();
        var overlayView  = this.shareRoomContainer.getViewTop();
        overlayView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearOverlayBackgroundClickedEvent, this);
    },

    /**
     * @protected
     */
    deinitializeEventListeners: function() {
        this._super();
        var overlayView  = this.shareRoomContainer.getViewTop();
        overlayView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.hearOverlayBackgroundClickedEvent, this);
    },

    /**
     * @protected
     */
    initializeCommandSubscriptions: function() {
        this._super();
        this.commandModule.subscribe(CommandType.DISPLAY.SHARE_ROOM_OVERLAY, this.handleDisplayShareRoomOverlayCommand, this);
        this.commandModule.subscribe(CommandType.HIDE.SHARE_ROOM_OVERLAY, this.handleHideShareRoomOverlayCommand, this);
        this.commandModule.subscribe(CommandType.DISPLAY.CODE_EDITOR_FULLSCREEN, this.handleDisplayCodeEditorOverlayWidgetCommand, this);
        this.commandModule.subscribe(CommandType.HIDE.CODE_EDITOR_FULLSCREEN, this.handleHideCodeEditorOverlayWidgetCommand, this);
    },

    /**
     * @protected
     */
    deinitializeCommandSubscriptions: function() {
        this._super();
        this.commandModule.unsubscribe(CommandType.DISPLAY.SHARE_ROOM_OVERLAY, this.handleDisplayShareRoomOverlayCommand, this);
        this.commandModule.unsubscribe(CommandType.HIDE.SHARE_ROOM_OVERLAY, this.handleHideShareRoomOverlayCommand, this);
        this.commandModule.unsubscribe(CommandType.DISPLAY.CODE_EDITOR_FULLSCREEN, this.handleDisplayCodeEditorOverlayWidgetCommand, this);
        this.commandModule.unsubscribe(CommandType.HIDE.CODE_EDITOR_FULLSCREEN, this.handleHideCodeEditorOverlayWidgetCommand, this);
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


    setDocumentTitle: function() {
        document.title = this.roomModel.getProperty("name");
    },

    handleDisplayCodeEditorOverlayWidgetCommand: function(message) {
        console.log("handleDisplayCodeEditorOverlayWidgetCommand");
        var data    = message.getData();
        var tabSize = data.tabSize;
        var text    = data.text;
        var mode    = data.mode;
        var theme   = data.theme;
        console.log("data:", data);
        if(!this.codeEditorOverlayWidgetContainer){
            this.codeEditorOverlayWidgetContainer = new CodeEditorOverlayWidgetContainer();
        }
        this.addContainerChild(this.codeEditorOverlayWidgetContainer, ".page");
        this.codeEditorOverlayWidgetContainer.setEditorText(text);
        this.codeEditorOverlayWidgetContainer.setEditorMode(mode);
        this.codeEditorOverlayWidgetContainer.setEditorTheme(theme);
        this.codeEditorOverlayWidgetContainer.setEditorTabSize(tabSize);
        this.codeEditorOverlayWidgetContainer.getViewTop().show();
        this.codeEditorOverlayWidgetContainer.focusOnAceEditor();
    },

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

    //-------------------------------------------------------------------------------
    // Protected Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {string} roomId
     */
    loadRoom: function(roomId) {
        console.log("Loading roomModel inside of RoomPageContainer#loadRoomModel");
        var _this = this;

        //TODO start loading animation
        // var blackoutLoaderContainer = new BlackoutLoaderContainer();
        // this.addContainerChild(blackoutLoaderContainer);

        this.roomManagerModule.retrieveRoom(roomId, function(throwable, roomMeldDocument) {
            if (!throwable) {
                _this.roomModel.setMeldDocument(roomMeldDocument);
                //TODO stop loading animation
            } else {

                //TODO stop loading animation
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
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    hearOverlayBackgroundClickedEvent: function(event) {
        this.hideShareRoomOverlay();
    },


    //-------------------------------------------------------------------------------
    // Message Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Message} message
     */
    handleDisplayShareRoomOverlayCommand: function(message) {
        this.viewTop.$el.find(".share-room-overlay").show();
    },

    /**
     * @private
     * @param {Message} message
     */
    handleHideShareRoomOverlayCommand: function(message) {
        this.hideShareRoomOverlay();
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
