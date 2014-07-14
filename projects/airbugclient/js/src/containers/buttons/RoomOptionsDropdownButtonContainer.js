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

//@Export('airbug.RoomOptionsDropdownButtonContainer')

//@Require('Class')
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
    var property                    = PropertyTag.property;
    var view                        = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ButtonContainer}
     */
    var RoomOptionsDropdownButtonContainer = Class.extend(ButtonContainer, {

        _name: "airbug.RoomOptionsDropdownButtonContainer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {RoomModel} roomModel
         */
        _constructor: function(roomModel) {

            this._super("RoomOptionsDropdownButton");


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            // Models
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {RoomModel}
             */
            this.roomModel                      = roomModel;


            // Modules
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {CommandModule}
             */
            this.commandModule                  = null;

            /**
             * @private
             * @type {NavigationModule}
             */
            this.navigationModule               = null;

            /**
             * @private
             * @type {RoomManagerModule}
             */
            this.roomManagerModule              = null;


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
            this.leaveRoomPermanentlyButtonView = null;
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

            view(ButtonDropdownView)
                .name("buttonView")
                .attributes({type: "primary", align: "right"})
                .children([
                    view(IconView)
                        .appendTo("#dropdown-button-{{cid}}")
                        .attributes({
                            type: IconView.Type.CHEVRON_DOWN,
                            color: IconView.Color.WHITE
                        }),
                    view(DropdownItemView)
                        .name("leaveRoomPermanentlyButtonView")
                        .appendTo("#dropdown-list-{{cid}}")
                        .children([
                            view(TextView)
                                .appendTo("#dropdown-item-{{cid}}")
                                .attributes({text: "Leave conversation permanently"})
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
            this.leaveRoomPermanentlyButtonView.removeEventListener(DropdownViewEvent.EventType.DROPDOWN_SELECTED, this.hearLeaveRoomPermanentlyButtonClickedEvent, this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.leaveRoomPermanentlyButtonView.addEventListener(DropdownViewEvent.EventType.DROPDOWN_SELECTED, this.hearLeaveRoomPermanentlyButtonClickedEvent, this);
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Event} event
         */
        hearLeaveRoomPermanentlyButtonClickedEvent: function(event) {
            var _this = this;
            this.roomManagerModule.leaveRoom(this.roomModel.getProperty("id"), function(throwable){
                if(throwable) {
                    _this.commandModule.relayCommand(CommandModule.CommandType.FLASH.ERROR, {message: "Unable to leave room permanently because " + throwable.getMessage()});
                }
                _this.navigationModule.navigate("home", {
                    trigger: true
                });
            });
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(RoomOptionsDropdownButtonContainer).with(
        autowired().properties([
            property("commandModule").ref("commandModule"),
            property("navigationModule").ref("navigationModule"),
            property("roomManagerModule").ref("roomManagerModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.RoomOptionsDropdownButtonContainer", RoomOptionsDropdownButtonContainer);
});
