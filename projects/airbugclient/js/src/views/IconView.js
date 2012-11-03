//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('IconView')

//@Require('Class')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var IconView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<i class="icon-{{iconType}} {{iconColorClass}}"></i>',


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
         * @type {?IconView.Color}
         */
        this.color = options.color;

        /**
         * @private
         * @type {?string}
         */
        this.type = options.type;
    },


    //-------------------------------------------------------------------------------
    // MustacheView Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data = this._super();
        data.iconColorClass = "";
        switch (this.color) {
            case IconView.Color.WHITE:
                data.iconColorClass += "icon-white";
                break;
        }
        data.iconType = this.type;
        return data;
    }
});

/**
 * @enum {number}
 */
IconView.Color = {
    BLACK: 1,
    WHITE: 2
};

/**
 * @enum {string}
 */
IconView.Type = {
    CHEVRON_LEFT: "chevron-left",
    USER: "user"
};