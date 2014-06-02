//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.UserHomePageContainer')

//@Require('Class')
//@Require('airbug.AccountDropdownButtonContainer')
//@Require('airbug.CodeEditorOverlayWidgetContainer')
//@Require('airbug.CommandModule')
//@Require('airbug.CreateRoomFormContainer')
//@Require('airbug.MultiColumnView')
//@Require('airbug.PageContainer')
//@Require('airbug.RoomListPanelContainer')
//@Require('airbug.TwoColumnView')
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                               = bugpack.require('Class');
    var AccountDropdownButtonContainer      = bugpack.require('airbug.AccountDropdownButtonContainer');
    var CodeEditorOverlayWidgetContainer    = bugpack.require('airbug.CodeEditorOverlayWidgetContainer');
    var CommandModule                       = bugpack.require('airbug.CommandModule');
    var CreateRoomFormContainer             = bugpack.require('airbug.CreateRoomFormContainer');
    var MultiColumnView                     = bugpack.require('airbug.MultiColumnView');
    var PageContainer                       = bugpack.require('airbug.PageContainer');
    var RoomListPanelContainer              = bugpack.require('airbug.RoomListPanelContainer');
    var TwoColumnView                       = bugpack.require('airbug.TwoColumnView');
    var BugMeta                             = bugpack.require('bugmeta.BugMeta');
    var AutowiredTag                 = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag                  = bugpack.require('bugioc.PropertyTag');
    var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired                           = AutowiredTag.autowired;
    var bugmeta                             = BugMeta.context();
    var CommandType                         = CommandModule.CommandType;
    var property                            = PropertyTag.property;
    var view                                = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {PageContainer}
     */
    var UserHomePageContainer = Class.extend(PageContainer, {

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
             * @type {CommandModule}
             */
            this.commandModule                      = null;

            /**
             * @private
             * @type {DocumentUtil}
             */
            this.documentUtil                       = null;


            // Containers
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {AccountDropdownButtonContainer}
             */
            this.accountDropdownButtonContainer     = null;

            /**
             * @private
             * @type {CreateRoomFormContainer}
             */
            this.createRoomFormContainer            = null;

            /**
             * @private
             * @type {RoomListPanelContainer}
             */
            this.roomListPanelContainer             = null;


            // Views
            //-------------------------------------------------------------------------------

            /**
             * @protected
             * @type {TwoColumnView}
             */
            this.twoColumnView          = null;
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
            this.documentUtil.setTitle("Home page - airbug");
        },

        /**
         * @protected
         */
        createContainer: function() {
            this._super();

            view(TwoColumnView)
                .name("twoColumnView")
                .attributes({
                    configuration: TwoColumnView.Configuration.THICK_RIGHT_SMALL,
                    rowStyle: MultiColumnView.RowStyle.FLUID
                })
                .build(this);

            this.fourColumnView.addViewChild(this.twoColumnView, "#column2of4-{{cid}}");
        },

        /**
         * @protected
         */
        createContainerChildren: function() {
            this._super();
            this.accountDropdownButtonContainer     = new AccountDropdownButtonContainer();
            this.createRoomFormContainer            = new CreateRoomFormContainer();
            this.roomListPanelContainer             = new RoomListPanelContainer();
            this.addContainerChild(this.accountDropdownButtonContainer, '#header-right');
            this.addContainerChild(this.roomListPanelContainer, ".2column-container .column1of2");
            this.addContainerChild(this.createRoomFormContainer, ".2column-container .column2of2");
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();
            this.commandModule.unsubscribe(CommandType.DISPLAY.CODE_EDITOR_FULLSCREEN, this.handleDisplayCodeEditorOverlayWidgetCommand, this);
            this.commandModule.unsubscribe(CommandType.HIDE.CODE_EDITOR_FULLSCREEN, this.handleHideCodeEditorOverlayWidgetCommand, this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.commandModule.subscribe(CommandType.DISPLAY.CODE_EDITOR_FULLSCREEN, this.handleDisplayCodeEditorOverlayWidgetCommand, this);
            this.commandModule.subscribe(CommandType.HIDE.CODE_EDITOR_FULLSCREEN, this.handleHideCodeEditorOverlayWidgetCommand, this);
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
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(UserHomePageContainer).with(
        autowired().properties([
            property("commandModule").ref("commandModule"),
            property("documentUtil").ref("documentUtil")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.UserHomePageContainer", UserHomePageContainer);
});
