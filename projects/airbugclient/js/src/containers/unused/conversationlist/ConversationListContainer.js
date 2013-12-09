//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ConversationListContainer')

//@Require('Class')
//@Require('airbug.ConversationListItemView')
//@Require('airbug.ListView')
//@Require('airbug.ListViewEvent')
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var ConversationListItemView    = bugpack.require('airbug.ConversationListItemView');
var ListView                    = bugpack.require('airbug.ListView');
var ListViewEvent               = bugpack.require('airbug.ListViewEvent');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var AutowiredAnnotation         = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation          = bugpack.require('bugioc.PropertyAnnotation');
var CarapaceContainer           = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                 = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                     = BugMeta.context();
var autowired                   = AutowiredAnnotation.autowired;
var property                    = PropertyAnnotation.property;
var view                        = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

//TODO BRN: Add support for current selected conversation. The conversation that we're currently viewing should be
// highlighted in this panel.

var ConversationListContainer = Class.extend(CarapaceContainer, {

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

        /**
         * @private
         * @type {ConversationList}
         */
        this.conversationList               = null;


        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ConversationManagerModule}
         */
        this.conversationManagerModule      = null;

        /**
         * @private
         * @type {NavigationModule}
         */
        this.navigationModule               = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ListView}
         */
        this.listView                       = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<*>} routerArgs
     */
    activateContainer: function(routerArgs) {
        this._super(routerArgs);
        //TODO BRN:

    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------

        this.conversationList       = this.conversationManagerModule.generateConversationList();


        // Create Views
        //-------------------------------------------------------------------------------

        this.listView               = view(ListView).build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.listView);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();

        //TODO BRN: Add listeners

        this.listView.addEventListener(ListViewEvent.EventType.ITEM_SELECTED, this.hearListViewItemSelectedEvent, this);
    },


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    buildConversationListItemView: function(conversationModel) {
        /*var conversationListItemView = new ConversationListItemView({
            model: conversationModel
        });
        this.listView.addViewChild(conversationListItemView);*/
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {ListViewEvent} event
     */
    hearListViewItemSelectedEvent: function(event) {
        var conversation = event.getData();
        var context = conversation.context;
        var fragment = "";

        if (context.type === "contact") {
            fragment = "contact/" + context.uuid;
        } else if (context.type === "room") {
            fragment = "room/" + context.uuid;
        } else {
            throw new Error("unrecognized conversation context type");
        }

        this.navigationModule.navigate(fragment, {
            trigger: true
        });
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(ConversationListContainer).with(
    autowired().properties([
        property("navigationModule").ref("navigationModule"),
        property("conversationManagerModule").ref("conversationManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ConversationListContainer", ConversationListContainer);
