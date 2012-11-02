//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ContactPanelContainer')

//@Require('CarapaceContainer')
//@Require('Class')
//@Require('ContactCollection')
//@Require('ContactPanelView')
//@Require('NavigationMessage')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ContactPanelContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(apiPublisher) {

        this._super(apiPublisher);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ContactCollection}
         */
        this.contactCollection = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    activateContainer: function() {
        //TODO BRN:

        //TEST
        this.contactCollection.add(new ContactModel({uid: "aN9o234", firstName: "Tim", lastName: "Pote", status: "away"}));
        this.contactCollection.add(new ContactModel({uid: "nv40pfs", firstName: "Brian", lastName: "Neisler", status: "available"}));
        this.contactCollection.add(new ContactModel({uid: "amvp06d", firstName: "Adam", lastName: "Nisenbaum", status: "dnd"}));
        this.contactCollection.add(new ContactModel({uid: "djGh4DA", firstName: "Tom", lastName: "Raic", status: "offline"}));
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

        this.contactPanelView = new ContactPanelView({
            collection: this.contactCollection
        });


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.contactPanelView);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.contactPanelView.addEventListener(ContactPanelEvent.EventTypes.CONTACT_SELECTED, this.hearContactSelectedEvent, this);
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
     * @param {ContactPanelEvent} event
     */
    hearContactSelectedEvent: function(event) {
        this.apiPublisher.publish(NavigationMessage.MessageTopics.NAVIGATE, {
            fragment: "contact/" + contact.uid,
            options: {
                trigger: true
            }
        });
    }
});
