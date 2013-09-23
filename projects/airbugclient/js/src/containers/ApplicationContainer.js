//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ApplicationContainer')

//@Require('Class')
//@Require('airbug.ApplicationView')
//@Require('airbug.BodyView')
//@Require('airbug.ApplicationHeaderView')
//@Require('airbug.NotificationView')
//@Require('carapace.CarapaceContainer')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var ApplicationView         = bugpack.require('airbug.ApplicationView');
var BodyView                = bugpack.require('airbug.BodyView');
var ApplicationHeaderView   = bugpack.require('airbug.ApplicationHeaderView');
var NotificationView        = bugpack.require('airbug.NotificationView');
var CarapaceContainer       = bugpack.require('carapace.CarapaceContainer');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ApplicationContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {airbug.ApplicationView}
         */
        this.applicationView    = null;

        /**
         * @private
         * @type {airbug.BodyView}
         */
        this.bodyView           = null;

        /**
         * @private
         * @type {airbug.ApplicationHeaderView}
         */
        this.headerView         = null;

        /**
         * @private
         * @type {airbug.NotificationView}
         */
        this.notificationView   = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {airbug.ApplicationView}
     */
    getApplicationView: function() {
        return this.applicationView;
    },

    /**
     * @return {airbug.BodyView}
     */
    getBodyView: function() {
        return this.bodyView;
    },

    /**
     * return {airbug.ApplicationHeaderView}
     */
    getHeaderView: function() {
        return this.headerView;
    },

    /**
     * return {airbug.NotificationView}
     */
    getNotificationView: function() {
        return this.notificationView;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Overrides
    //-------------------------------------------------------------------------------

    /**
     *
     */
    create: function(routingArgs) {
        if (!this.created) {
            this.created = true;
            this.createApplication(routingArgs);
            this.initializeApplication();
        }
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function(routingArgs) {
        this._super();

        // Create Views
        //-------------------------------------------------------------------------------

        this.headerView         = new HeaderView({id: "applicationHeaderView"});
        this.applicationView    = new ApplicationView({id: "applicationView"});
        this.notificationView   = new NotificationView({id: "notificationView"});

        this.bodyView.addViewChild(this.headerView);
        this.bodyView.addViewChild(this.applicationView);
        this.bodyView.addViewChild(this.notificationView);

        this.setViewTop(this.bodyView);
    },

    createContainerChildren: function() {
        this.super();
    },

    /**
     * @protected
     */
    destroyContainer: function() {
        this.headerView.dispose();
        this.applicationView.dispose();
        this.notificationView.dispose();
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
    createApplication: function(routingArgs) {
        this.bodyView = new BodyView();
        this.bodyView.create();
        this.bodyView.hide();
        this.createContainer(routingArgs);
        this.createContainerChildren(routingArgs);
        this.bodyView.show();
    },

    /**
     * @private
     */
    initializeApplication: function() {
        this.initializeContainer();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ApplicationContainer", ApplicationContainer);
