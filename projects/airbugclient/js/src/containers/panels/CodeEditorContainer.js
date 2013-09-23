//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('CodeEditorContainer')

//@Require('Class')
//@Require('ace.Ace')
//@Require('airbug.BoxWithHeaderAndFooterView')
//@Require('airbug.TextView')
//@Require('airbug.TwoColumnView')
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Ace                         = bugpack.require('ace.Ace');
var BoxWithHeaderAndFooterView  = bugpack.require('airbug.BoxWithHeaderAndFooterView');
var TextView                    = bugpack.require('airbug.TextView');
var TwoColumnView               = bugpack.require('airbug.TwoColumnView');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var AutowiredAnnotation         = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation          = bugpack.require('bugioc.PropertyAnnotation');
var CarapaceContainer           = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                 = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta     = BugMeta.context();
var autowired   = AutowiredAnnotation.autowired;
var property    = PropertyAnnotation.property;
var view        = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CodeEditorContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Models
        //-------------------------------------------------------------------------------


        // Modules
        //-------------------------------------------------------------------------------


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {airbug.BoxWithHeaderAndFooterView}
         */
        this.boxView                   = null;


        // Containers
        //-------------------------------------------------------------------------------


    },


    //-------------------------------------------------------------------------------
    // CarapaceController Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<*>} routerArgs
     */
    activateContainer: function(routerArgs) {
        var _this = this;
        this._super(routerArgs);

    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------


        // Create Views
        //-------------------------------------------------------------------------------

        this.boxView =
            view(BoxWithHeaderAndFooterView)
                .children([
                    view(TextView)
                        .attributes({text: "Code Editor"})
                        .appendTo(".box-header")
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.boxView);
    },

    createContainerChildren: function() {
        this.super();
        this.embedCodeButton = new EmbedCodeButton();
        this.addContainerChild(this.embedCodeButton, ".box-footer");
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
    },


    configureAceEditor: function(){
        var aceEditor = Ace.edit(".box-body");
        editor.setTheme("ace/theme/textmate");
        editor.getSession().setMode("ace/mode/javascript");
    },

    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {ListViewEvent} event
     */
    hearListViewItemSelectedEvent: function(event) {

    },

    //-------------------------------------------------------------------------------
    // Model Event Handlers
    //-------------------------------------------------------------------------------


});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CodeEditorContainer", CodeEditorContainer);
