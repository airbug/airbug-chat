//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ApplicationController')

//@Require('Class')
//@Require('carapace.CarapaceController')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var CarapaceController  = bugpack.require('carapace.CarapaceController');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ApplicationController = Class.extend(CarapaceController, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        this.currentUserManagerModule = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    initializeController: function() {
        this._super();
    },

    /**
     * @Override
     * @protected
     * @param {RoutingRequest} routingRequest
     */
    filterRouting: function(routingRequest) {
        //TODO
        console.log("CurrentUser:", this.currentUserManagerModule.currentUser);
        if(!this.currentUserManagerModule.currentUser){
            routingRequest.forward("login");
        } else if(!this.currentUserManagerModule.currentUser.email){
            routingRequest.forward("login");
        } else {
            routingRequest.accept();
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ApplicationController", ApplicationController);

