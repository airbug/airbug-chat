//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RoomMemberListItemContainer')

//@Require('Class')
//@Require('airbug.SelectableListItemView')
//@Require('airbug.UserNameView')
//@Require('airbug.UserStatusIndicatorView')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


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

var RoomMemberListItemContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(roomMemberModel) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
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

        this.selectableListItemView =
            view(SelectableListItemView)
                .model(this.roomMemberModel)
                .children([
                    view(UserStatusIndicatorView)
                        .model(this.roomMemberModel)
                        .appendTo('*[id|=list-item]'),
                    view(UserNameView)
                        .model(this.roomMemberModel)
                        .attributes({classes: "text-simple"})
                        .appendTo('*[id|=list-item]')
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.selectableListItemView);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomMemberListItemContainer", RoomMemberListItemContainer);
