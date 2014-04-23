//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.DialoguePageContainer')

//@Require('Class')
//@Require('ClearChange')
//@Require('Exception')
//@Require('RemovePropertyChange')
//@Require('SetPropertyChange')
//@Require('airbug.AccountDropdownButtonContainer')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.CodeEditorOverlayWidgetContainer')
//@Require('airbug.CommandModule')
//@Require('airbug.DialogueChatBoxContainer')
//@Require('airbug.DialogueModel')
//@Require('airbug.HomeButtonContainer')
//@Require('airbug.PageContainer')
//@Require('airbug.RoomListPanelContainer')
//@Require('airbug.UserModel')
//@Require('bugflow.BugFlow')
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
    var DialogueChatBoxContainer            = bugpack.require('airbug.DialogueChatBoxContainer');
    var DialogueModel                       = bugpack.require('airbug.DialogueModel');
    var HomeButtonContainer                 = bugpack.require('airbug.HomeButtonContainer');
    var PageContainer                       = bugpack.require('airbug.PageContainer');
    var RoomListPanelContainer              = bugpack.require('airbug.RoomListPanelContainer');
    var UserModel                           = bugpack.require('airbug.UserModel');
    var BugFlow                             = bugpack.require('bugflow.BugFlow');
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
    var $series                             = BugFlow.$series;
    var $task                               = BugFlow.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {PageContainer}
     */
    var DialoguePageContainer = Class.extend(PageContainer, {

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
             * @type {null}
             */
            this.codeEditorOverlayWidgetContainer       = null;

            /**
             * @private
             * @type {DialogueChatBoxContainer}
             */
            this.dialougeChatBoxContainer               = null;

            /**
             * @private
             * @type {HomeButtonContainer}
             */
            this.homeButtonContainer                    = null;

            /**
             * @private
             * @type {RoomsHamburgerButtonContainer}
             */
            this.roomsHamburgerButtonContainer          = null;


            // Models
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {DialogueModel}
             */
            this.dialogueModel                          = null;

            /**
             * @private
             * @type {UserModel}
             */
            this.otherUserModel                         = null;


            // Modules
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {CommandModule}
             */
            this.commandModule                          = null;

            /**
             * @private
             * @type {CurrentUserManagerModule}
             */
            this.currentUserManagerModule               = null;

            /**
             * @private
             * @type {DialogueManagerModule}
             */
            this.dialogueManagerModule                  = null;

            /**
             * @private
             * @type {NavigationModule}
             */
            this.navigationModule                       = null;

            /**
             * @private
             * @type {UserManagerModule}
             */
            this.userManagerModule                      = null;
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
            this.loadDialogue(this.dialogueModel.getProperty("id"));

            //TODO BRN: Title should be set to the name of the user the current user is chatting with

        },

        /**
         * @protected
         */
        createContainer: function(routingArgs) {
            this._super(routingArgs);

            var id = routingArgs[0];

            // Create Models
            //-------------------------------------------------------------------------------

            model(DialogueModel)
                .data({id: id})
                .name("dialogueModel")
                .build(this);

            model(UserModel)
                .name("otherUserModel")
                .build(this);
        },

        /**
         * @protected
         */
        createContainerChildren: function(routingArgs) {
            this._super(routingArgs);

            this.accountDropdownButtonContainer         = new AccountDropdownButtonContainer();
            this.codeEditorOverlayWidgetContainer       = new CodeEditorOverlayWidgetContainer();
            this.dialougeChatBoxContainer               = new DialogueChatBoxContainer(this.dialogueModel, this.otherUserModel);
            this.homeButtonContainer                    = new HomeButtonContainer();
            this.roomListPanelContainer                 = new RoomListPanelContainer();

            this.addContainerChild(this.accountDropdownButtonContainer,     "#header-right");
            this.addContainerChild(this.codeEditorOverlayWidgetContainer,   "#page-" + this.getPageView().getCid());
            this.addContainerChild(this.dialougeChatBoxContainer,           "#column2of4-" + this.getFourColumnView().getCid());
            this.addContainerChild(this.homeButtonContainer,                "#header-left");
            this.addContainerChild(this.roomListPanelContainer,             "#column1of4-" + this.getFourColumnView().getCid());
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();
            this.dialogueModel.unobserve(ClearChange.CHANGE_TYPE, "", this.observeDialogueModelClearChange, this);
            this.dialogueModel.unobserve(SetPropertyChange.CHANGE_TYPE, "userIdPair", this.observeUserIdPairSetPropertyChange, this);
            this.dialogueModel.unobserve(RemovePropertyChange.CHANGE_TYPE, "userIdPair", this.observeUserIdPairRemovePropertyChange, this);
            this.otherUserModel.unobserve(ClearChange.CHANGE_TYPE, "", this.observeOtherUserNameChange, this);
            this.otherUserModel.unobserve(SetPropertyChange.CHANGE_TYPE, ["firstName", "lastName"], this.observeOtherUserNameChange, this);
            this.otherUserModel.unobserve(RemovePropertyChange.CHANGE_TYPE, ["firstName", "lastName"], this.observeOtherUserNameChange, this);

            this.commandModule.unsubscribe(CommandType.DISPLAY.CODE_EDITOR_FULLSCREEN, this.handleDisplayCodeEditorOverlayWidgetCommand, this);
            this.commandModule.unsubscribe(CommandType.HIDE.CODE_EDITOR_FULLSCREEN, this.handleHideCodeEditorOverlayWidgetCommand, this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.dialogueModel.observe(ClearChange.CHANGE_TYPE, "", this.observeDialogueModelClearChange, this);
            this.dialogueModel.observe(SetPropertyChange.CHANGE_TYPE, "userIdPair", this.observeUserIdPairSetPropertyChange, this);
            this.dialogueModel.observe(RemovePropertyChange.CHANGE_TYPE, "userIdPair", this.observeUserIdPairRemovePropertyChange, this);
            this.otherUserModel.observe(ClearChange.CHANGE_TYPE, "", this.observeOtherUserNameChange, this);
            this.otherUserModel.observe(SetPropertyChange.CHANGE_TYPE, ["firstName", "lastName"], this.observeOtherUserNameChange, this);
            this.otherUserModel.observe(RemovePropertyChange.CHANGE_TYPE, ["firstName", "lastName"], this.observeOtherUserNameChange, this);

            this.commandModule.subscribe(CommandType.DISPLAY.CODE_EDITOR_FULLSCREEN, this.handleDisplayCodeEditorOverlayWidgetCommand, this);
            this.commandModule.subscribe(CommandType.HIDE.CODE_EDITOR_FULLSCREEN, this.handleHideCodeEditorOverlayWidgetCommand, this);

            this.codeEditorOverlayWidgetContainer.getViewTop().hide();
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        clearOtherUser: function() {
            this.otherUserModel.clear();
        },

        /**
         * @private
         * @param {string} dialogueId
         */
        loadDialogue: function(dialogueId) {
            var _this = this;
            this.dialogueManagerModule.retrieveDialogue(dialogueId, function(throwable, meldDocument) {
                if (!throwable) {
                    _this.dialogueModel.setMeldDocument(meldDocument);
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

        /**
         * @protected
         * @param {Pair.<string>} userIdPair
         */
        loadOtherUser: function(userIdPair) {
            var _this = this;

            /** @type {CurrentUser} */
            var currentUser             = null;
            /** @type {MeldDocument} */
            var otherUserMeldDocument    = null;

            $series([
                $task(function(flow) {
                    _this.currentUserManagerModule.retrieveCurrentUser(function(throwable, retrievedCurrentUser) {
                        if (!throwable) {
                            currentUser = retrievedCurrentUser;
                        }
                        flow.complete(throwable);
                    })
                }),
                $task(function(flow) {
                    /** @type {string} */
                    var otherUserId              = userIdPair.getOther(currentUser.getId());
                    _this.userManagerModule.retrieveUser(otherUserId, function(throwable, returnedUserMeldDocument) {
                        if (!throwable) {
                            otherUserMeldDocument = returnedUserMeldDocument;
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.otherUserModel.setUserMeldDocument(otherUserMeldDocument);
                    flow.complete();
                })
            ]).execute(function(throwable) {
                if (throwable) {
                    _this.logger.error(throwable);
                }
            });
        },


        //-------------------------------------------------------------------------------
        // Message Handlers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Message} message
         */
        handleDisplayCodeEditorOverlayWidgetCommand: function(message) {
            var data            = message.getData();
            var tabSize         = data.tabSize;
            var cursorPosition  = data.cursorPosition;
            var showInvisibles  = data.showInvisibles;
            var text            = data.text;
            var mode            = data.mode;
            var theme           = data.theme;

            this.codeEditorOverlayWidgetContainer.getViewTop().show();
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
        },


        //-------------------------------------------------------------------------------
        // Model Observers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Observation} observation
         */
        observeUserIdPairRemovePropertyChange: function(observation) {
            this.clearOtherUser();
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeUserIdPairSetPropertyChange: function(observation) {
            var change = /** @type {SetPropertyChange} */(observation.getChange());
            this.clearOtherUser();
            this.loadOtherUser(change.getPropertyValue());
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeDialogueModelClearChange: function(observation) {
            this.clearOtherUser();
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeOtherUserNameChange: function(observation) {
            var fullName    = "";
            var firstName   = this.otherUserModel.getProperty("firstName");
            if (firstName) {
                fullName += firstName + " ";
            }
            var lastName    = this.otherUserModel.getProperty("lastName");
            if (lastName) {
                fullName += lastName;
            }
            this.documentUtil.setTitle(fullName);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(DialoguePageContainer).with(
        autowired().properties([
            property("commandModule").ref("commandModule"),
            property("currentUserManagerModule").ref("currentUserManagerModule"),
            property("dialogueManagerModule").ref("dialogueManagerModule"),
            property("documentUtil").ref("documentUtil"),
            property("navigationModule").ref("navigationModule"),
            property("userManagerModule").ref("userManagerModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.DialoguePageContainer", DialoguePageContainer);
});
