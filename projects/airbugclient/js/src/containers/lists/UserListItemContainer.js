//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('UserListItemContainer')

//@Require('CarapaceContainer')
//@Require('Class')
//@Require('ContactCollection')
//@Require('ContactModel')
//@Require('ListView')
//@Require('NavigationMessage')
//@Require('SelectableListItemView')
//@Require('TextView')
//@Require('UserNameView')
//@Require('UserStatusIndicatorView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserListItemContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(apiPublisher) {

        this._super(apiPublisher);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {UserModel}
         */
        this.userModel = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {SelectableListItemView}
         */
        this.selectableListItemView = null;

        /**
         * @private
         * @type {UserNameView}
         */
        this.userNameView = null;

        /**
         * @private
         * @type {UserStatusIndicatorView}
         */
        this.userStatusIndicatorView = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------

        this.userModel = new UserModel();
        this.addModel(this.userModel);


        // Create Views
        //-------------------------------------------------------------------------------

        this.selectableListItemView = new SelectableListItemView({
            model: this.userModel
        });
        this.userNameView = new UserNameView({
            model: this.userModel,
            classes: "text-simple"
        });
        this.userStatusIndicatorView = new UserStatusIndicatorView({
            model: this.userModel
        });


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.selectableListItemView.addViewChild(this.userStatusIndicatorView, '#list-item-' + this.selectableListItemView.cid);
        this.selectableListItemView.addViewChild(this.userNameView, '#list-item-' + this.selectableListItemView.cid);
        this.setViewTop(this.selectableListItemView);
    },

    /**
     * @protected
     */
    destroyContainer: function() {
        this._super();
        this.userModel = null;
    }
});
