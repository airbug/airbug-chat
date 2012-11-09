//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ContactListItemContainer')

//@Require('Class')
//@Require('UserListItemContainer')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ContactListItemContainer = Class.extend(UserListItemContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(apiPublisher, contactModel) {

        this._super(apiPublisher);


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

        //TEST
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
