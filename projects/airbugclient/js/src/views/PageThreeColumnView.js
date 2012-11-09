//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('PageThreeColumnView')

//@Require('Class')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var PageThreeColumnView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    template:   '<div id="page-{{cid}}" class="page column">' +
                    '<div class="row column">' +
                        '<div id="page-leftrow" class="{{leftColumnSpan}} column leftrow"></div>' +
                        '<div id="page-centerrow" class="{{centerColumnSpan}} column centerrow"></div>' +
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
        data.leftColumnSpan = "span2";
        data.centerColumnSpan = "span8";
        data.rightColumnSpan = "span2";
        switch (this.configuration) {
            case PageThreeColumnView.Configuration.THICK_RIGHT:
                data.rightColumnSpan = "span3";
                data.centerColumnSpan = "span7";
                break;
        }
        return data;
    }
});

/**
 * @enum {number}
 */
PageThreeColumnView.Configuration = {
    DEFAULT: 1,
    THICK_RIGHT: 2
};
