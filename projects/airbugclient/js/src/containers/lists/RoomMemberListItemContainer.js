//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RoomMemberListItemContainer')

//@Require('Class')
//@Require('airbug.UserListItemContainer')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var UserListItemContainer   = bugpack.require('airbug.UserListItemContainer');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomMemberListItemContainer = Class.extend(UserListItemContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(roomMemberModel) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Modules
        //-------------------------------------------------------------------------------

        this.userManagerModule  = null;

        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {RoomMemberModel}
         */
        this.roomMemberModel    = roomMemberModel;
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
        //TODO BRN: This is where we would load the user model associated with this contact.
        var _this   = this;
        var userId  = this.roomMemberModel.get("userId");
        this.userManagerModule.retrieveUser(userId, function(error, userObj){
            if(!error && userObj){
                //NOTE might want to change this to roomMemberModel later to prevent conflicts with private currentUser information
                _this.userModel.set(userObj);
            }
        });
        console.log("Inside RoomMemberListItemContainer#activateContainer");
    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();

        //NOTE BRN: We need to override the selectable model so that the correct model data is sent when an item is
        //selected.

        this.selectableListItemView.model = this.roomMemberModel;
    }
});

annotate(RoomMemberListItemContainer).with(
    autowired().properties([
        property("userManagerModule").ref("userManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomMemberListItemContainer", RoomMemberListItemContainer);
