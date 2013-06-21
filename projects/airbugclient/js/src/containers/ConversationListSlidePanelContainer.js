//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ConversationListSlidePanelContainer')

//@Require('Class')
//@Require('airbug.ConversationListContainer')
//@Require('airbug.SlidePanelView')
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
var ConversationListContainer   = bugpack.require('airbug.ConversationListContainer');
var SlidePanelView              = bugpack.require('airbug.SlidePanelView');
var CarapaceContainer           = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                 = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ConversationListSlidePanelContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ConversationListContainer}
         */
        this.conversationListContainer  = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {SlidePanelView}
         */
        this.slidePanelView             = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function() {
        this._super();

        // Create Views
        //-------------------------------------------------------------------------------

        this.slidePanelView = view(SlidePanelView).build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.slidePanelView);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.conversationListContainer = new ConversationListContainer();
        this.addContainerChild(this.conversationListContainer, "#panel-body-" + this.slidePanelView.cid);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ConversationListSlidePanelContainer", ConversationListSlidePanelContainer);
