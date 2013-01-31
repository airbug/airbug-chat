//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('UserPasswordSettingsView')

//@Require('Class')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =         bugpack.require('Class');
var MustacheView =  bugpack.require('airbug.MustacheView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserPasswordSettingsView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div>' +
                    '<span class="setting-label text">Password:</span>' +
                    '<span class="text user-password">**********</span>' +
                '</div>'
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.UserPasswordSettingsView", UserPasswordSettingsView);
