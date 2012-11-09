//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('PageTwoColumnView')

//@Require('Class')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var PageTwoColumnView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    template:   '<div id="page-{{cid}}" class="page column">' +
                    '<div class="row column">' +
                        '<div id="page-leftrow" class="{{leftColumnSpan}} column leftrow"></div>' +
                        '<div id="page-rightrow" class="{{rightColumnSpan}} column rightrow"></div>' +
                    '</div>' +
                '</div>',


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(options) {
        this._super(options);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {?string}
         */
        this.configuration = options.configuration;
    },


    //-------------------------------------------------------------------------------
    // MustacheView Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data = this._super();
        data.leftColumnSpan = "span6";
        data.rightColumnSpan = "span6";
        switch (this.configuration) {
            case PageTwoColumnView.Configuration.THIN_RIGHT:
                data.leftColumnSpan = "span9";
                data.rightColumnSpan = "span3";
                break;
        }
        return data;
    }
});

/**
 * @enum {number}
 */
PageTwoColumnView.Configuration = {
    DEFAULT: 1,
    THIN_RIGHT: 2
};
