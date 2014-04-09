//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.AccountDropdownButtonContainer')

//@Require('Class')
//@Require('airbug.ButtonContainer')
//@Require('airbug.ButtonDropdownView')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.CommandModule')
//@Require('airbug.DropdownItemDividerView')
//@Require('airbug.DropdownItemView')
//@Require('airbug.DropdownViewEvent')
//@Require('airbug.IconView')
//@Require('airbug.TextView')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var ButtonContainer         = bugpack.require('airbug.ButtonContainer');
var ButtonDropdownView      = bugpack.require('airbug.ButtonDropdownView');
var ButtonViewEvent         = bugpack.require('airbug.ButtonViewEvent');
var CommandModule           = bugpack.require('airbug.CommandModule');
var DropdownItemDividerView = bugpack.require('airbug.DropdownItemDividerView');
var DropdownItemView        = bugpack.require('airbug.DropdownItemView');
var DropdownViewEvent       = bugpack.require('airbug.DropdownViewEvent');
var IconView                = bugpack.require('airbug.IconView');
var TextView                = bugpack.require('airbug.TextView');
var AutowiredAnnotation     = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var ViewBuilder             = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired               = AutowiredAnnotation.autowired;
var bugmeta                 = BugMeta.context();
var CommandType             = CommandModule.CommandType;
var property                = PropertyAnnotation.property;
var view                    = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {ButtonContainer}
 */
var AccountDropdownButtonContainer = Class.extend(ButtonContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super("AccountDropdownButton");


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CommandModule}
         */
        this.commandModule                  = null;

        /**
         * @private
         * @type {CurrentUserManagerModule}
         */
        this.currentUserManagerModule       = null;

        /**
         * @private
         * @type {NavigationModule}
         */
        this.navigationModule               = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ButtonDropdownView}
         */
        this.buttonView                     = null;

        /**
         * @private
         * @type {DropdownItemView}
         */
        this.logoutItemView                 = null;

        /**
         * @private
         * @type {DropdownItemView}
         */
        this.settingsItemView               = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function() {
        this._super();

        // Create Views
        //-------------------------------------------------------------------------------

        view(ButtonDropdownView)
            .name("buttonView")
            .attributes({type: "primary", align: "right"})
            .children([
                view(IconView)
                    .appendTo("#dropdown-button-{{cid}}")
                    .attributes({
                        type: IconView.Type.USER,
                        color: IconView.Color.WHITE
                    }),
                view(DropdownItemView)
                    .name("settingsItemView")
                    .appendTo("#dropdown-list-{{cid}}")
                    .children([
                        view(TextView)
                            .appendTo("#dropdown-item-{{cid}}")
                            .attributes({text: "Settings"})
                    ]),
                view(DropdownItemDividerView)
                    .appendTo("#dropdown-list-{{cid}}"),
                view(DropdownItemView)
                    .name("logoutItemView")
                    .appendTo("#dropdown-list-{{cid}}")
                    .children([
                        view(TextView)
                            .appendTo("#dropdown-item-{{cid}}")
                            .attributes({text: "Logout"})
                    ])
            ])
            .build(this);


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.buttonView);
    },

    /**
     * @protected
     */
    deinitializeContainer: function() {
        this._super();
        this.logoutItemView.removeEventListener(DropdownViewEvent.EventType.DROPDOWN_SELECTED, this.hearLogoutItemDropdownSelected, this);
        this.settingsItemView.removeEventListener(DropdownViewEvent.EventType.DROPDOWN_SELECTED, this.hearSettingsItemDropdownSelected, this);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.logoutItemView.addEventListener(DropdownViewEvent.EventType.DROPDOWN_SELECTED, this.hearLogoutItemDropdownSelected, this);
        this.settingsItemView.addEventListener(DropdownViewEvent.EventType.DROPDOWN_SELECTED, this.hearSettingsItemDropdownSelected, this);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    hearLogoutItemDropdownSelected: function(event) {
        var _this = this;
        this.currentUserManagerModule.logout(function(throwable) {
            if (!throwable) {
                _this.navigationModule.navigate("login", {
                    trigger: true
                });
            } else {

                //TODO BRN: Need to introduce some sort of error handling system that can take any error and figure out what to do with it and what to show the user

                if (Class.doesExtend(throwable, Exception)) {
                    _this.commandModule.relayCommand(CommandType.FLASH.EXCEPTION, {message: throwable.getMessage()});
                } else {
                    _this.commandModule.relayCommand(CommandType.FLASH.ERROR, {message: "Sorry an error has occurred" + throwable});
                }
            }
        });
    },

    /**
     * @private
     * @param {Event} event
     */
    hearSettingsItemDropdownSelected: function(event) {
        this.navigationModule.navigate("settings", {
            trigger: true
        });
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(AccountDropdownButtonContainer).with(
    autowired().properties([
        property("commandModule").ref("commandModule"),
        property("currentUserManagerModule").ref("currentUserManagerModule"),
        property("navigationModule").ref("navigationModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.AccountDropdownButtonContainer", AccountDropdownButtonContainer);
