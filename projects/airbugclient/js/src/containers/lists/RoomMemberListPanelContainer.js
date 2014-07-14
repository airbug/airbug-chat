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

//@Export('airbug.RoomMemberListPanelContainer')

//@Require('Class')
//@Require('airbug.AddRoomMemberButtonContainer')
//@Require('airbug.RoomMemberListContainer')
//@Require('carapace.ButtonView')
//@Require('carapace.ButtonViewEvent')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.PanelWithHeaderView')
//@Require('carapace.TextView')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                           = bugpack.require('Class');
    var AddRoomMemberButtonContainer    = bugpack.require('airbug.AddRoomMemberButtonContainer');
    var RoomMemberListContainer         = bugpack.require('airbug.RoomMemberListContainer');
    var ButtonView                      = bugpack.require('carapace.ButtonView');
    var ButtonViewEvent                 = bugpack.require('carapace.ButtonViewEvent');
    var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
    var PanelWithHeaderView             = bugpack.require('carapace.PanelWithHeaderView');
    var TextView                        = bugpack.require('carapace.TextView');
    var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var view                            = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CarapaceContainer}
     */
    var RoomMemberListPanelContainer = Class.extend(CarapaceContainer, {

        _name: "airbug.RoomMemberListPanelContainer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {RoomModel} roomModel
         */
        _constructor: function(roomModel) {

            this._super();


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


            // Views
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {PanelView}
             */
            this.panelView                      = null;


            // Containers
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {AddRoomMemberButtonContainer}
             */
            this.addRoomMemberButtonContainer   = null;

            /**
             * @private
             * @type {RoomMemberListContainer}
             */
            this.roomMemberListContainer        = null;
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

            view(PanelWithHeaderView)
                .name("panelView")
                .attributes({
                    classes: "roommember-list-panel",
                    headerTitle: "Participants"
                })
                .build(this);


            // Wire Up Views
            //-------------------------------------------------------------------------------

            this.setViewTop(this.panelView);
        },

        /**
         * @protected
         */
        createContainerChildren: function() {
            this._super();
            this.addRoomMemberButtonContainer   = new AddRoomMemberButtonContainer();
            this.roomMemberListContainer        = new RoomMemberListContainer(this.roomModel);
            this.addContainerChild(this.roomMemberListContainer, "#panel-body-" + this.panelView.getCid());
            this.addContainerChild(this.addRoomMemberButtonContainer, "#panel-header-nav-right-" + this.panelView.getCid());
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.RoomMemberListPanelContainer", RoomMemberListPanelContainer);
});
