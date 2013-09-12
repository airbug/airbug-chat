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

    /**
     * @param {airbug.RoomMemberModel} roomMemberModel
     */
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
        var _this   = this;
        var userId  = this.roomMemberModel.get("userId");
        this.userManagerModule.retrieveUser(userId, function(error, userMeldObj){
            if(!error && userMeldObj){
                //NOTE might want to change this to an more fleshed out version of roomMemberModel later to prevent conflicts with private currentUser information
                var userObj = userMeldObj.generateObject();
                _this.userModel.set(userObj);
            } else {
                //TODO error handling
                // retry condition
                // roomMember may no longer exist. If so, destroy container?
            }
        });
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

bugmeta.annotate(RoomMemberListItemContainer).with(
    autowired().properties([
        property("userManagerModule").ref("userManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomMemberListItemContainer", RoomMemberListItemContainer);
