//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('MustacheView')

//@Require('Class')
//@Require('carapace.CarapaceView')
//@Require('mustache.Mustache')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =         bugpack.require('Class');
var CarapaceView =  bugpack.require('carapace.CarapaceView');
var Mustache =      bugpack.require('mustache.Mustache');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MustacheView = Class.extend(CarapaceView, {

    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Element}
     */
    make: function() {
        var data = this.generateTemplateData();
        return $(Mustache.render(this.template, data));
    },


    //-------------------------------------------------------------------------------
    // CarapaceView Extensions
    //-------------------------------------------------------------------------------


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data = {};
        data.model = this.model ? this.model.toJSON() : {};
        data.attributes = this.attributes;
        data.cid = this.cid;
        return data;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.MustacheView", MustacheView);
