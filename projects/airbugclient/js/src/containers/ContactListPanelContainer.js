//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ContactListPanelContainer')

//@Require('ButtonView')
//@Require('CarapaceContainer')
//@Require('Class')
//@Require('ContactCollection')
//@Require('ContactModel')
//@Require('ListItemView')
//@Require('ListView')
//@Require('NavigationMessage')
//@Require('PanelWithHeaderView')
//@Require('TextView')
//@Require('UserNameView')
//@Require('UserStatusIndicatorView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ContactListPanelContainer = Class.extend(CarapaceContainer, {

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
         * @type {ButtonView}
         */
        this.addContactButtonView = null;

        /**
         * @private
         * @type {ListView}
         */
        this.listView = null;

        /**
         * @private
         * @type {PanelView}
         */
        this.panelView = null;

        /**
         * @private
         * @type {TextView}
         */
        this.textView = null;
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
        this.contactCollection.add(new ContactModel({uuid: "aN9o234", firstName: "Tim", lastName: "Pote", status: "away"}));
        this.contactCollection.add(new ContactModel({uuid: "nv40pfs", firstName: "Brian", lastName: "Neisler", status: "available"}));
        this.contactCollection.add(new ContactModel({uuid: "amvp06d", firstName: "Adam", lastName: "Nisenbaum", status: "dnd"}));
        this.contactCollection.add(new ContactModel({uuid: "djGh4DA", firstName: "Tom", lastName: "Raic", status: "offline"}));
    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------

        this.contactCollection = new ContactCollection();
        this.addModel(this.contactCollection);


        // Create Views
        //-------------------------------------------------------------------------------

        this.addContactButtonView = new ButtonView({size: ButtonView.Size.SMALL});
        this.listView = new ListView({});
        this.panelView = new PanelWithHeaderView({headerTitle: "Contacts"});
        this.textView = new TextView({text: "+"});


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.addContactButtonView.addViewChild(this.textView, "#button-" + this.addContactButtonView.cid);
        this.panelView.addViewChild(this.addContactButtonView, "#panel-header-nav-" + this.panelView.cid);
        this.panelView.addViewChild(this.listView, "#panel-body-" + this.panelView.cid);
        this.setViewTop(this.panelView);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.contactCollection.bind('add', this.handleContactCollectionAdd, this);
        this.listView.addEventListener(ListViewEvent.EventTypes.ITEM_SELECTED, this.hearListViewItemSelectedEvent, this);
    },

    /**
     * @protected
     */
    destroyContainer: function() {
        this._super();
        this.contactCollection = null;
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
        var listItemView = new ListItemView({
            model: contactModel
        });
        var userNameView = new UserNameView({
            model: contactModel
        });
        var userStatusIndicatorView = new UserStatusIndicatorView({
            model: contactModel
        });
        listItemView.addViewChild(userStatusIndicatorView);
        listItemView.addViewChild(userNameView);
        this.listView.addViewChild(listItemView);
    }
});
