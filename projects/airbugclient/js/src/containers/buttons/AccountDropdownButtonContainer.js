/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.AccountDropdownButtonContainer')

//@Require('Class')
//@Require('Exception')
//@Require('airbug.ButtonContainer')
//@Require('airbug.CommandModule')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('carapace.ButtonDropdownView')
//@Require('carapace.ButtonViewEvent')
//@Require('carapace.DropdownItemDividerView')
//@Require('carapace.DropdownItemView')
//@Require('carapace.DropdownViewEvent')
//@Require('carapace.IconView')
//@Require('carapace.TextView')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var Exception                   = bugpack.require('Exception');
    var ButtonContainer             = bugpack.require('airbug.ButtonContainer');
    var CommandModule               = bugpack.require('airbug.CommandModule');
    var AutowiredTag                = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag                 = bugpack.require('bugioc.PropertyTag');
    var BugMeta                     = bugpack.require('bugmeta.BugMeta');
    var ButtonDropdownView          = bugpack.require('carapace.ButtonDropdownView');
    var ButtonViewEvent             = bugpack.require('carapace.ButtonViewEvent');
    var DropdownItemDividerView     = bugpack.require('carapace.DropdownItemDividerView');
    var DropdownItemView            = bugpack.require('carapace.DropdownItemView');
    var DropdownViewEvent           = bugpack.require('carapace.DropdownViewEvent');
    var IconView                    = bugpack.require('carapace.IconView');
    var TextView                    = bugpack.require('carapace.TextView');
    var ViewBuilder                 = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired                   = AutowiredTag.autowired;
    var bugmeta                     = BugMeta.context();
    var CommandType                 = CommandModule.CommandType;
    var property                    = PropertyTag.property;
    var view                        = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ButtonContainer}
     */
    var AccountDropdownButtonContainer = Class.extend(ButtonContainer, {

        _name: "airbug.AccountDropdownButtonContainer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
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

    bugmeta.tag(AccountDropdownButtonContainer).with(
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
});
