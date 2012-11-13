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
//@Require('ViewBuilder')


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view = ViewBuilder.view;


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

        this.userModel = new UserModel({}, "userModel");
        this.addModel(this.userModel);


        // Create Views
        //-------------------------------------------------------------------------------

        this.selectableListItemView =
            view(SelectableListItemView)
                .model(this.userModel)
                .children([
                    view(UserStatusIndicatorView)
                        .model(this.userModel)
                        .appendTo('*[id|=list-item]'),
                    view(UserNameView)
                        .model(this.userModel)
                        .attributes({classes: "text-simple"})
                        .appendTo('*[id|=list-item]')
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.selectableListItemView);
    }
});
