//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ConversationModel')

//@Require('Class')
//@Require('carapace.CarapaceModel')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var CarapaceModel   = bugpack.require('carapace.CarapaceModel');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ConversationModel = Class.extend(CarapaceModel, {

    //-------------------------------------------------------------------------------
    // CarapaceModel Implementation
    //-------------------------------------------------------------------------------

    defaults: {
        uuid: "",
        name: "",
        unreadMessageCount: 0,
        unreadMessagePreview: "",
        context: {
            type: "",
            uuid: ""
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ConversationModel", ConversationModel);
