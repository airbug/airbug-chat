//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('UserNamePanelContainer')

//@Require('Class')
//@Require('airbug.PanelView')
//@Require('airbug.UserNameView')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =             bugpack.require('Class');
var PanelView =         bugpack.require('airbug.PanelView');
var UserNameView =      bugpack.require('airbug.UserNameView');
var CarapaceContainer = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder =       bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserNamePanelContainer = Class.extend(CarapaceContainer, {

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
        this.userModel = userModel;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {PanelView}
         */
        this.panelView = null;
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

        this.panelView =
            view(PanelView)
                .children([
                    view(UserStatusIndicatorView)
                        .model(this.userModel)
                        .appendTo('*[id|="panel-body"]'),
                    view(UserNameView)
                        .model(this.userModel)
                        .appendTo('*[id|="panel-body"]')
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.panelView);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.UserNamePanelContainer", UserNamePanelContainer);
