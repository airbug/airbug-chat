//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('TextAreaView')

//@Require('Class')
//@Require('MustacheView')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var TextAreaView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<textarea id="text-area-{{cid}}" rows="{{options.rows}}">{{options.placeholder}}</textarea>',


    //-------------------------------------------------------------------------------
    // MustacheView Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data = this._super();
        if (!TypeUtil.isNumber(data.options.rows)) {
            data.options.rows = 3;
        }
        return data;
    }
});
