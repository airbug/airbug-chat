//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.MustacheView')

//@Require('Class')
//@Require('LiteralUtil')
//@Require('carapace.CarapaceView')
//@Require('mustache.Mustache')
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var LiteralUtil             = bugpack.require('LiteralUtil');
    var CarapaceView            = bugpack.require('carapace.CarapaceView');
    var Mustache                = bugpack.require('mustache.Mustache');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var AutowiredAnnotation     = bugpack.require('bugioc.AutowiredAnnotation');
    var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                 = BugMeta.context();
    var autowired               = AutowiredAnnotation.autowired;
    var property                = PropertyAnnotation.property;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @constructor
     * @extends {CarapaceView}
     */
    var MustacheView = Class.extend(CarapaceView, {

        _name: "airbug.MustacheView",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Object} options
         */
        _constructor: function(options) {

            this._super(options);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {AirbugStaticConfig}
             */
            this.airbugStaticConfig = null;
        },


        //-------------------------------------------------------------------------------
        // BugView Methods
        //-------------------------------------------------------------------------------

        /**
         * @override
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
            var data            = {};
            data.model          = this.model ? LiteralUtil.convertToLiteral(this.model) : {};
            data.attributes     = this.attributes;
            data.cid            = this.getCid();
            data.id             = this.getId() || "input-" + this.getCid();
            data.classes        = this.getAttribute("classes") || "";
            data.staticUrl      = this.airbugStaticConfig.getStaticUrl();
            return data;
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(MustacheView).with(
        autowired().properties([
            property("airbugStaticConfig").ref("airbugStaticConfig")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.MustacheView", MustacheView);
});