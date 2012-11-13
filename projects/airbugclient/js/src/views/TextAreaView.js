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

    template:   '<textarea id="text-area-{{cid}}" rows="{{attributes.rows}}">{{attributes.placeholder}}</textarea>',


    //-------------------------------------------------------------------------------
    // MustacheView Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data = this._super();
        if (!TypeUtil.isNumber(data.attributes.rows)) {
            data.attributes.rows = 3;
        }
        return data;
    }
});
