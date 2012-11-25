//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('SettingsPanelContainer')

//@Require('Annotate')
//@Require('AutowiredAnnotation')
//@Require('CarapaceContainer')
//@Require('Class')
//@Require('ListView')
//@Require('ListViewEvent')
//@Require('PropertyAnnotation')
//@Require('SelectableListItemView')
//@Require('UserEmailSettingsView')
//@Require('UserNameSettingsView')
//@Require('UserPasswordSettingsView')
//@Require('ViewBuilder')


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate = Annotate.annotate;
var autowired = AutowiredAnnotation.autowired;
var property = PropertyAnnotation.property;
var view = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SettingsPanelContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {UserModel}
         */
        this.currentUserModel = null;


        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {NavigationModule}
         */
        this.navigationModule = null;

        /**
         * @private
         * @type {SessionModule}
         */
        this.sessionModule = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ListItemView}
         */
        this.listItemUserEmailView = null;

        /**
         * @private
         * @type {ListItemView}
         */
        this.listItemUserNameView = null;

        /**
         * @private
         * @type {ListItemView}
         */
        this.listItemUserPasswordView = null;

        /**
         * @private
         * @type {PanelView}
         */
        this.panelView = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<*>} routerArgs
     */
    activateContainer: function(routerArgs) {
        this._super(routerArgs);
        //TODO BRN:

    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------

        this.currentUserModel = this.sessionModule.getCurrentUserModel();


        // Create Views
        //-------------------------------------------------------------------------------

        this.panelView =
            view(PanelWithHeaderView)
                .attributes({headerTitle: "Settings"})
                .children([
                    view(ListView)
                        .appendTo('*[id|="panel-body"]')
                        .children([
                            view(SelectableListItemView)
                                .id("listItemUserNameView")
                                .children([
                                    view(UserNameSettingsView)
                                        .model(this.currentUserModel)
                                ]),
                            view(SelectableListItemView)
                                .id("listItemUserEmailView")
                                .children([
                                    view(UserEmailSettingsView)
                                        .model(this.currentUserModel)
                                ]),
                            view(SelectableListItemView)
                                .id("listItemUserPasswordView")
                                .children([
                                    view(UserPasswordSettingsView)
                                        .model(this.currentUserModel)
                                ])
                        ])
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.panelView);
        this.listItemUserEmailView = this.findViewById("listItemUserEmailView");
        this.listItemUserNameView = this.findViewById("listItemUserNameView");
        this.listItemUserPasswordView = this.findViewById("listItemUserPasswordView");
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.listItemUserEmailView.addEventListener(ListViewEvent.EventType.ITEM_SELECTED,
            this.hearListItemUserEmailViewSelectedEvent, this);
        this.listItemUserNameView.addEventListener(ListViewEvent.EventType.ITEM_SELECTED,
            this.hearListItemUserNameViewSelectedEvent, this);
        this.listItemUserPasswordView.addEventListener(ListViewEvent.EventType.ITEM_SELECTED,
            this.hearListItemUserPasswordViewSelectedEvent, this);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    hearListItemUserEmailViewSelectedEvent: function(event) {
        this.navigationModule.navigate("settings/email", {
            trigger: true
        });
    },

    /**
     * @private
     * @param {Event} event
     */
    hearListItemUserNameViewSelectedEvent: function(event) {
        this.navigationModule.navigate("settings/name", {
            trigger: true
        });
    },

    /**
     * @private
     * @param {Event} event
     */
    hearListItemUserPasswordViewSelectedEvent: function(event) {
        this.navigationModule.navigate("settings/password", {
            trigger: true
        });
    }
});

annotate(SettingsPanelContainer).with(
    autowired().properties([
        property("navigationModule").ref("navigationModule"),
        property("sessionModule").ref("sessionModule")
    ])
);
