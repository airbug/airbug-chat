//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('AccountButtonDropdownContainer')

//@Require('Class')
//@Require('airbug.ButtonContainer')
//@Require('airbug.ButtonDropdownView')
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

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var ButtonContainer             = bugpack.require('airbug.ButtonContainer');
var ButtonDropdownView          = bugpack.require('airbug.ButtonDropdownView');
var DropdownItemDividerView     = bugpack.require('airbug.DropdownItemDividerView');
var DropdownItemView            = bugpack.require('airbug.DropdownItemView');
var DropdownViewEvent           = bugpack.require('airbug.DropdownViewEvent');
var IconView                    = bugpack.require('airbug.IconView');
var TextView                    = bugpack.require('airbug.TextView');
var AutowiredAnnotation         = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation          = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var ViewBuilder                 = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired   = AutowiredAnnotation.autowired;
var bugmeta     = BugMeta.context();
var property    = PropertyAnnotation.property;
var view        = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {ButtonContainer}
 */
var AccountButtonDropdownContainer = Class.extend(ButtonContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super("AccountButtonDropdown");


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------


        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CurrentUserManagerModule}
         */
        this.currentUserManagerModule   = null;

        /**
         * @private
         * @type {NavigationModule}
         */
        this.navigationModule           = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ButtonDropdownView}
         */
        this.buttonDropdownView         = null;

        /**
         * @private
         * @type {DropdownItemView}
         */
        this.logoutDropdownItemView     = null;

        /**
         * @private
         * @type {DropdownItemView}
         */
        this.settingsDropdownItemView   = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function() {
        this._super();

        // Create Views
        //-------------------------------------------------------------------------------

        this.buttonDropdownView =
            view(ButtonDropdownView)
                .attributes({type: "primary", align: "right"})
                .children([
                    view(IconView)
                        .attributes({type: IconView.Type.USER, color: IconView.Color.WHITE})
                        .appendTo('*[id|="button"]'),
                    view(DropdownItemView)
                        .id("settingsDropdownItemView")
                        .appendTo('*[id|="dropdown-list"]')
                        .children([
                            view(TextView)
                                .attributes({text: "Settings"})
                                .appendTo('*[id|="dropdown-item"]')
                        ]),
                    view(DropdownItemDividerView)
                        .appendTo('*[id|="dropdown-list"]'),
                    view(DropdownItemView)
                        .id("logoutDropdownItemView")
                        .appendTo('*[id|="dropdown-list"]')
                        .children([
                            view(TextView)
                                .attributes({text: "Logout"})
                                .appendTo('*[id|="dropdown-item"]')
                        ])
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.buttonDropdownView);
        this.logoutDropdownItemView     = this.findViewById("logoutDropdownItemView");
        this.settingsDropdownItemView   = this.findViewById("settingsDropdownItemView");
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.logoutDropdownItemView.addEventListener(DropdownViewEvent.EventType.DROPDOWN_SELECTED,
            this.hearLogoutDropdownSelectedEvent, this);
        this.settingsDropdownItemView.addEventListener(DropdownViewEvent.EventType.DROPDOWN_SELECTED,
            this.hearSettingsDropdownSelectedEvent, this);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    hearLogoutDropdownSelectedEvent: function(event) {
        var _this = this;
        this.currentUserManagerModule.logout(function(throwable) {
            if (!throwable) {
                _this.navigationModule.navigate("goodbye", {
                    trigger: true
                });
            } else {
                // TODO BRN: Show error popup
                // TODO BRN: What should we do if we are already logged out? How would this happen? If it does,
                // perhaps we just redirect to the goodbye page. Some how the states have gotten out of sync.
            }
        });
    },

    /**
     * @private
     * @param {Event} event
     */
    hearSettingsDropdownSelectedEvent: function(event) {
        this.navigationModule.navigate("settings", {
            trigger: true
        });
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(AccountButtonDropdownContainer).with(
    autowired().properties([
        property("currentUserManagerModule").ref("currentUserManagerModule"),
        property("navigationModule").ref("navigationModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.AccountButtonDropdownContainer", AccountButtonDropdownContainer);
