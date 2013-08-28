//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ConversationListContainer')

//@Require('Class')
//@Require('airbug.ConversationCollection')
//@Require('airbug.ConversationListItemView')
//@Require('airbug.ConversationModel')
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

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =                     bugpack.require('Class');
var ConversationCollection =    bugpack.require('airbug.ConversationCollection');
var ConversationListItemView =  bugpack.require('airbug.ConversationListItemView');
var ConversationModel =         bugpack.require('airbug.ConversationModel');
var ListView =                  bugpack.require('airbug.ListView');
var ListViewEvent =             bugpack.require('airbug.ListViewEvent');
var BugMeta = bugpack.require('bugmeta.BugMeta');
var AutowiredAnnotation =       bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation =        bugpack.require('bugioc.PropertyAnnotation');
var CarapaceContainer =         bugpack.require('carapace.CarapaceContainer');
var ViewBuilder =               bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta = BugMeta.context();
var autowired = AutowiredAnnotation.autowired;
var property = PropertyAnnotation.property;
var view = ViewBuilder.view;


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
         * @type {ConversationCollection}
         */
        this.conversationCollection = null;


        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {NavigationModule}
         */
        this.navigationModule = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ListView}
         */
        this.listView = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<*>} routerArgs
     */
    activateContainer: function(routerArgs) {
        this._super(routerArgs);
        //TODO BRN:

        this.conversationCollection.add(new ConversationModel({
            uuid: "1aRtls0",
            name: "Tim Pote",
            unreadMessageCount: 4,
            unreadMessagePreview: "Hey bro!",
            context: {
                type: "contact",
                uuid: "aN9o234"
            }
        }));
        this.conversationCollection.add(new ConversationModel({
            uuid: "bn6LPsd",
            name: "airbug Company Room",
            unreadMessageCount: 20,
            unreadMessagePreview:"Brian: We have our first customer! Also, this is a really long message that should eventually overflow the preview because i just kept typing and typing and typing and typing and typing and typing and typing and typing and typing...",
            context: {
                type: "room",
                uuid: "g13Dl0s"
            }
        }));
        this.conversationCollection.add(new ConversationModel({
            uuid: "PLn865D",
            name: "airbug Dev Room",
            unreadMessageCount: 105,
            unreadMessagePreview: "Brian: Can someone checkout bug air-542?",
            context: {
                type: "room",
                uuid: "nb0psdf"
            }
        }));
    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------

        this.conversationCollection = new ConversationCollection([], "conversationCollection");
        this.addCollection(this.conversationCollection);


        // Create Views
        //-------------------------------------------------------------------------------

        this.listView = view(ListView).build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.listView);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.conversationCollection.bind('add', this.handleConversationCollectionAdd, this);
        this.listView.addEventListener(ListViewEvent.EventType.ITEM_SELECTED, this.hearListViewItemSelectedEvent, this);
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
    },


    //-------------------------------------------------------------------------------
    // Model Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @param {ConversationModel} conversationModel
     */
    handleConversationCollectionAdd: function(conversationModel) {
        var conversationListItemView = new ConversationListItemView({
            model: conversationModel
        });
        this.listView.addViewChild(conversationListItemView);
    }
});

bugmeta.annotate(ConversationListContainer).with(
    autowired().properties([
        property("navigationModule").ref("navigationModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ConversationListContainer", ConversationListContainer);
