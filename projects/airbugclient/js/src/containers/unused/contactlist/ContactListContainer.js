//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ContactListContainer')

//@Require('Class')
//@Require('airbug.ContactListItemContainer')
//@Require('airbug.ContactModel')
//@Require('airbug.ListView')
//@Require('airbug.SelectableListItemView')
//@Require('airbug.TextView')
//@Require('airbug.UserNameView')
//@Require('airbug.UserStatusIndicatorView')
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
var ContactListItemContainer =  bugpack.require('airbug.ContactListItemContainer');
var ContactModel =              bugpack.require('airbug.ContactModel');
var ListView =                  bugpack.require('airbug.ListView');
var SelectableListItemView =    bugpack.require('airbug.SelectableListItemView');
var TextView =                  bugpack.require('airbug.TextView');
var UserNameView =              bugpack.require('airbug.UserNameView');
var UserStatusIndicatorView =   bugpack.require('airbug.UserStatusIndicatorView');
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

var ContactListContainer = Class.extend(CarapaceContainer, {

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
         * @type {ContactList}
         */
        this.contactList = null;


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


    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------

        this.contactList = this.contactManagerModule.generateContactList();


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

        //TODO BRN: Add listeners

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
        var contact = event.getData();
        this.navigationModule.navigate("contact/" + contact.uuid, {
            trigger: true
        });
    },


    //-------------------------------------------------------------------------------
    // Model Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @param {ContactModel} contactModel
     */
    handleContactCollectionAdd: function(contactModel) {
        var contactListItemContainer = new ContactListItemContainer(contactModel);
        this.addContainerChild(contactListItemContainer, "#list-" + this.listView.cid);
    }
});

bugmeta.annotate(ContactListContainer).with(
    autowired().properties([
        property("navigationModule").ref("navigationModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ContactListContainer", ContactListContainer);
