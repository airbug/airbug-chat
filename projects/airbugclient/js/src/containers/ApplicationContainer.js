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

var bugpack                 = require('bugpack').context();


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

/**
 * @constructor
 * @extends {CarapaceContainer}
 */
var ApplicationContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ApplicationView}
         */
        this.applicationView        = null;

        /**
         * @private
         * @type {BodyView}
         */
        this.bodyView               = null;

        /**
         * @private
         * @type {ApplicationHeaderView}
         */
        this.applicationHeaderView  = null;

        /**
         * @private
         * @type {NotificationView}
         */
        this.notificationView       = null;
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
     * return {ApplicationHeaderView}
     */
    getApplicationHeaderView: function() {
        return this.applicationHeaderView;
    },

    /**
     * return {NotificationView}
     */
    getNotificationView: function() {
        return this.notificationView;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Overrides
    //-------------------------------------------------------------------------------

    /**
     * @override
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

        this.applicationHeaderView  = new ApplicationHeaderView({id: "application-header"});
        this.applicationView        = new ApplicationView({id: "application"});
        this.notificationView       = new NotificationView({id: "notification-container"});

        this.bodyView.addViewChild(this.applicationHeaderView);
        this.bodyView.addViewChild(this.applicationView);
        this.bodyView.addViewChild(this.notificationView);

        this.setViewTop(this.bodyView);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
    },

    /**
     * @override
     * @protected
     */
    destroyContainer: function() {
        this.applicationHeaderView.dispose();
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
