//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ContactListItemContainer')

//@Require('Class')
//@Require('airbug.UserListItemContainer')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =                 bugpack.require('Class');
var UserListItemContainer = bugpack.require('airbug.UserListItemContainer');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ContactListItemContainer = Class.extend(UserListItemContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(contactModel) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ContactModel}
         */
        this.contactModel = contactModel;
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


        if (this.contactModel.get("uuid") === "aN9o234") {
            this.userModel.set({uuid:"nmhsieh", firstName: "Tim", lastName: "Pote", status: "away"});
        } else if (this.contactModel.get("uuid") === "nv40pfs") {
            this.userModel.set({uuid: "a93hdug", firstName: "Brian", lastName: "Neisler", status: "available"})
        } else if (this.contactModel.get("uuid") === "amvp06d") {
            this.userModel.set({uuid: "18dh7fn", firstName: "Adam", lastName: "Nisenbaum", status: "dnd"});
        } else if (this.contactModel.get("uuid") === "djGh4DA") {
            this.userModel.set({uuid: "pm8e6ds", firstName: "Tom", lastName: "Raic", status: "offline"})
        }
    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();

        //NOTE BRN: We need to override the selectable model so that the correct model data is sent when an item is
        //selected.

        this.selectableListItemView.model = this.contactModel;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ContactListItemContainer", ContactListItemContainer);
