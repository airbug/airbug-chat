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
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        return this.model ? this.model.toJSON() : {};
    }
});
