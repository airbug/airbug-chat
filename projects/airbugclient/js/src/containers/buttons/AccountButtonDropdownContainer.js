//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('AccountButtonDropdownContainer')

//@Require('Class')
//@Require('airbug.ButtonDropdownView')
//@Require('airbug.DropdownItemView')
//@Require('airbug.DropdownViewEvent')
//@Require('airbug.IconView')
//@Require('annotate.Annotate')
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

var Class =                 bugpack.require('Class');
var ButtonDropdownView =    bugpack.require('airbug.ButtonDropdownView');
var DropdownItemView =      bugpack.require('airbug.DropdownItemView');
var DropdownViewEvent =     bugpack.require('airbug.DropdownViewEvent');
var IconView =              bugpack.require('airbug.IconView');
var Annotate =              bugpack.require('annotate.Annotate');
var AutowiredAnnotation =   bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation =    bugpack.require('bugioc.PropertyAnnotation');
var CarapaceContainer =     bugpack.require('carapace.CarapaceContainer');
var ViewBuilder =           bugpack.require('carapace.ViewBuilder');


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

var AccountButtonDropdownContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

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
         * @type {ButtonDropdownView}
         */
        this.buttonDropdownView = null;

        /**
         * @private
         * @type {DropdownItemView}
         */
        this.logoutDropdownItemView = null;

        /**
         * @private
         * @type {DropdownItemView}
         */
        this.settingsDropdownItemView = null;
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
        this.logoutDropdownItemView = this.findViewById("logoutDropdownItemView");
        this.settingsDropdownItemView = this.findViewById("settingsDropdownItemView");
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

        this.sessionModule.logout(function(response) {
            if (response.error) {
                // TODO BRN: Show error popup
                // TODO BRN: What should we do if we are already logged out? How would this happen? If it does,
                // perhaps we just redirect to the goodbye page. Some how the states have gotten out of sync.
            } else if (response.success) {
                _this.navigationModule.navigate("goodbye", {
                    trigger: true
                });
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

annotate(AccountButtonDropdownContainer).with(
    autowired().properties([
        property("navigationModule").ref("navigationModule"),
        property("sessionModule").ref("sessionModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.AccountButtonDropdownContainer", AccountButtonDropdownContainer);
