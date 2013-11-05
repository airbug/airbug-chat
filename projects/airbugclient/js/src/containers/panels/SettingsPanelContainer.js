//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('SettingsPanelContainer')

//@Require('Class')
//@Require('airbug.ListView')
//@Require('airbug.ListViewEvent')
//@Require('airbug.SelectableListItemView')
//@Require('airbug.UserEmailSettingsView')
//@Require('airbug.UserNameSettingsView')
//@Require('airbug.UserPasswordSettingsView')
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =                     bugpack.require('Class');
var ListView =                  bugpack.require('airbug.ListView');
var ListViewEvent =             bugpack.require('airbug.ListViewEvent');
var SelectableListItemView =    bugpack.require('airbug.SelectableListItemView');
var UserEmailSettingsView =     bugpack.require('airbug.UserEmailSettingsView');
var UserNameSettingsView =      bugpack.require('airbug.UserNameSettingsView');
var UserPasswordSettingsView =  bugpack.require('airbug.UserPasswordSettingsView');
var BugMeta = bugpack.require('bugmeta.BugMeta');
var AutowiredAnnotation =       bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation =        bugpack.require('bugioc.PropertyAnnotation');
var CarapaceContainer =         bugpack.require('carapace.CarapaceContainer');
var ViewBuilder =               bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta = BugMeta.context();
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
        this.userModel = null;


        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {NavigationModule}
         */
        this.navigationModule = null;


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

        this.currentUserModel = this.sessionModule.getFullUserModel();


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

bugmeta.annotate(SettingsPanelContainer).with(
    autowired().properties([
        property("navigationModule").ref("navigationModule"),
        property("sessionModule").ref("sessionModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.SettingsPanelContainer", SettingsPanelContainer);
