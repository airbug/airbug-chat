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
//@Require('ViewBuilder')


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view = ViewBuilder.view;


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

        this.panelView =
            view(PanelWithHeaderView)
                .attributes({headerTitle: "Contacts"})
                .children([
                    view(ButtonView)
                        .attributes({size: ButtonView.Size.SMALL})
                        .id("addContactButtonView")
                        .appendTo('*[id|="panel-header-nav"]')
                        .children([
                            view(TextView)
                                .attributes({text: "+"})
                                .appendTo('*[id|="button"]')
                        ])
                ])
                .build();

        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.panelView);
        this.addContactButtonView = this.findViewById("addContactButtonView");
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
