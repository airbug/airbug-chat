//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('MustacheView')

//@Require('CarapaceView')
//@Require('Class')
//@Require('Mustache')


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
