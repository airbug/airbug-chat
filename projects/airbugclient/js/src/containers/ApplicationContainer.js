//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ApplicationContainer')

//@Require('ApplicationView')
//@Require('CarapaceController')
//@Require('Class')
//@Require('HeaderView')
//@Require('NavigationMessage')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ApplicationContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(router) {

        this._super(router);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ApplicationView}
         */
        this.applicationView = null;

        /**
         * @private
         * @type {BodyView}
         */
        this.bodyView = null;

        /**
         * @private
         * @type {HeaderView}
         */
        this.headerView = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {ApplicationView}
     */
    getApplicationView: function() {
        return this.applicationView;
    },

    /**
     * @return {BodyView}
     */
    getBodyView: function() {
        return this.bodyView;
    },

    /**
     * return {HeaderView}
     */
    getHeaderView: function() {
        return this.headerView;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Overrides
    //-------------------------------------------------------------------------------

    /**
     *
     */
    create: function() {
        if (!this.created) {
            this.created = true;
            this.createApplication();
            this.initializeApplication();
        }
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function() {
        this._super();

        this.headerView = new HeaderView();
        this.applicationView = new ApplicationView();

        this.bodyView.addViewChild(this.headerView);
        this.bodyView.addViewChild(this.applicationView);
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    createApplication: function() {
        this.bodyView = new BodyView();
        this.bodyView.elDetach();
        this.createContainer();
        this.createContainerChildren();
        this.bodyView.elAppendTo('html');
    },

    /**
     * @private
     */
    initializeApplication: function() {
        this.initializeContainer();
    }
});
