//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ContactListContainer')

//@Require('Class')
//@Require('airbug.ContactCollection')
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
var ContactCollection =         bugpack.require('airbug.ContactCollection');
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
         * @type {ContactCollection}
         */
        this.contactCollection = null;


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


        // this.contactManagerModule.retrieveContacts(function(error, contacts){
        //  })
        //TEST
        this.contactCollection.add(new ContactModel({uuid: "aN9o234", userUuid: "nmhsieh", conversationUuid: "1aRtls0"})); //Tim
        this.contactCollection.add(new ContactModel({uuid: "nv40pfs", userUuid: "a93hdug", conversationUuid: "lm7497s"})); //Brian
        this.contactCollection.add(new ContactModel({uuid: "amvp06d", userUuid: "18dh7fn", conversationUuid: "g7pfcnd"})); //Adam
        this.contactCollection.add(new ContactModel({uuid: "djGh4DA", userUuid: "pm8e6ds", conversationUuid: "ldhsyin"})); //Tom
    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------

        this.contactCollection = new ContactCollection([]);
        this.addCollection("contactCollection", this.contactCollection);


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
        this.contactCollection.bind('add', this.handleContactCollectionAdd, this);
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
