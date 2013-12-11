//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('UserNameSettingsView')

//@Require('Class')
//@Require('airbug.UserNameView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var UserNameView    = bugpack.require('airbug.UserNameView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserNameSettingsView = Class.extend(UserNameView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div>' +
                    '<span class="setting-label text">Name:</span>' +
                    '<span id="user-name-{{cid}}" class="text user-name">{{model.firstName}} {{model.lastName}}</span>' +
                '</div>'
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.UserNameSettingsView", UserNameSettingsView);