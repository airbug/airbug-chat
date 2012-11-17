//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ApplicationContainer')

//@Require('ApplicationView')
//@Require('CarapaceController')
//@Require('Class')
//@Require('HeaderView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ApplicationContainer = Class.extend(CarapaceContainer, {

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

        // Create Views
        //-------------------------------------------------------------------------------

        this.headerView = new HeaderView({id: "headerView"});
        this.applicationView = new ApplicationView({id: "applicationView"});

        this.bodyView.addViewChild(this.headerView);
        this.bodyView.addViewChild(this.applicationView);
        this.setViewTop(this.bodyView);
    },

    /**
     * @proetected
     */
    destroyContainer: function() {
        this.headerView.dispose();
        this.applicationView.dispose();
        this.viewTop = null;
        this.collectionMap.forEach(function(collection) {
            collection.dispose();
        });
        this.collectionMap.clear();
        this.modelMap.forEach(function(model) {
            model.dispose();
        });
        this.modelMap.clear();
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    createApplication: function() {
        this.bodyView = new BodyView();
        this.bodyView.create();
        this.bodyView.hide();
        this.createContainer();
        this.createContainerChildren();
        this.bodyView.show();
    },

    /**
     * @private
     */
    initializeApplication: function() {
        this.initializeContainer();
    }
});
