//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.RoomMemberListItemContainer')

//@Require('Class')
//@Require('airbug.SelectableListItemView')
//@Require('airbug.UserNameView')
//@Require('airbug.UserStatusIndicatorView')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var SelectableListItemView      = bugpack.require('airbug.SelectableListItemView');
    var UserNameView                = bugpack.require('airbug.UserNameView');
    var UserStatusIndicatorView     = bugpack.require('airbug.UserStatusIndicatorView');
    var CarapaceContainer           = bugpack.require('carapace.CarapaceContainer');
    var ViewBuilder                 = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var view                        = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CarapaceContainer}
     */
    var RoomMemberListItemContainer = Class.extend(CarapaceContainer, {

        _name: "airbug.RoomMemberListItemContainer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {RoomMemberModel} roomMemberModel
         */
        _constructor: function(roomMemberModel) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            // Models
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {RoomMemberModel}
             */
            this.roomMemberModel            = roomMemberModel;


            // Views
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {SelectableListItemView}
             */
            this.selectableListItemView     = null;
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

            view(SelectableListItemView)
                .name("selectableListItemView")
                .model(this.roomMemberModel)
                .children([
                    view(UserStatusIndicatorView)
                        .model(this.roomMemberModel)
                        .appendTo("#list-item-{{cid}}"),
                    view(UserNameView)
                        .model(this.roomMemberModel)
                        .attributes({classes: "text-simple room-member-item"})
                        .appendTo("#list-item-{{cid}}")
                ])
                .build(this);


            // Wire Up Views
            //-------------------------------------------------------------------------------

            this.setViewTop(this.selectableListItemView);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.RoomMemberListItemContainer", RoomMemberListItemContainer);
});
