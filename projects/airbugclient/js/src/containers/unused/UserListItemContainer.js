//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('UserListItemContainer')

//@Require('Class')
//@Require('airbug.SelectableListItemView')
//@Require('airbug.UserNameView')
//@Require('airbug.UserStatusIndicatorView')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


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

var view = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserListItemContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(userModel) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {UserModel}
         */
        this.userModel              = userModel;


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


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.UserListItemContainer", UserListItemContainer);