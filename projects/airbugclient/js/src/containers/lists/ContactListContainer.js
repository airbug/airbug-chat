//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ContactListContainer')

//@Require('CarapaceContainer')
//@Require('Class')
//@Require('ContactCollection')
//@Require('ContactModel')
//@Require('ListView')
//@Require('NavigationMessage')
//@Require('SelectableListItemView')
//@Require('TextView')
//@Require('UserNameView')
//@Require('UserStatusIndicatorView')
//@Require('ViewBuilder')


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ContactListContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(apiPublisher) {

        this._super(apiPublisher);


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

        this.contactCollection = new ContactCollection([], "contactCollection");
        this.addCollection(this.contactCollection);


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
        this.listView.addEventListener(ListViewEvent.EventTypes.ITEM_SELECTED, this.hearListViewItemSelectedEvent, this);
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
        this.apiPublisher.publish(NavigationMessage.MessageTopics.NAVIGATE, {
            fragment: "contact/" + contact.uuid,
            options: {
                trigger: true
            }
        });
    },


    //-------------------------------------------------------------------------------
    // Model Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @param {ContactModel} contactModel
     */
    handleContactCollectionAdd: function(contactModel) {
        var contactListItemContainer = new ContactListItemContainer(this.apiPublisher, contactModel);
        this.addContainerChild(contactListItemContainer, "#list-" + this.listView.cid);
    }
});
