//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ContactListPanelContainer')

//@Require('ButtonView')
//@Require('CarapaceContainer')
//@Require('Class')
//@Require('ContactListContainer')
//@Require('PanelWithHeaderView')
//@Require('TextView')


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

        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ButtonView}
         */
        this.addContactButtonView = null;

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


        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ContactListContainer}
         */
        this.contactListContainer = null;
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

        this.addContactButtonView = new ButtonView({size: ButtonView.Size.SMALL});
        this.panelView = new PanelWithHeaderView({headerTitle: "Contacts"});
        this.textView = new TextView({text: "+"});


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.addContactButtonView.addViewChild(this.textView, "#button-" + this.addContactButtonView.cid);
        this.panelView.addViewChild(this.addContactButtonView, "#panel-header-nav-" + this.panelView.cid);
        this.setViewTop(this.panelView);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.contactListContainer = new ContactListContainer(this.apiPublisher);
        this.addContainerChild(this.contactListContainer, "#panel-body-" + this.panelView.cid);
    }
});
