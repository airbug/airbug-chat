//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ApplicationContainer')

//@Require('Class')
//@Require('airbug.ApplicationView')
//@Require('airbug.BodyView')
//@Require('airbug.ApplicationHeaderView')
//@Require('airbug.ErrorNotificationOverlayContainer')
//@Require('airbug.NotificationContainer')
//@Require('carapace.CarapaceContainer')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                               = bugpack.require('Class');
var ApplicationView                     = bugpack.require('airbug.ApplicationView');
var BodyView                            = bugpack.require('airbug.BodyView');
var ApplicationHeaderView               = bugpack.require('airbug.ApplicationHeaderView');
var ErrorNotificationOverlayContainer   = bugpack.require('airbug.ErrorNotificationOverlayContainer');
var NotificationContainer               = bugpack.require('airbug.NotificationContainer');
var CarapaceContainer                   = bugpack.require('carapace.CarapaceContainer');


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
        // Views
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

        //-------------------------------------------------------------------------------
        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {NotificationContainer}
         */
        this.notificationContainer  = null;
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

        this.bodyView.addViewChild(this.applicationHeaderView);
        this.bodyView.addViewChild(this.applicationView);

        this.setViewTop(this.bodyView);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.notificationContainer = new NotificationContainer();
        this.addContainerChild(this.notificationContainer, "body");
    },

    /**
     * @override
     * @protected
     */
    destroyContainer: function() {
        this.applicationHeaderView.dispose();
        this.applicationView.dispose();
        this.viewTop = null;
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
        this.initializeCatchAllUncaughtErrorsFunction();
    },

    initializeCatchAllUncaughtErrorsFunction: function() {
        var _this = this;
        var oldOnError = window.onerror;
        window.onerror = function(errorMessage, url, lineNumber){
            if(oldOnError){ //uncaught execption
                var errorObject = {
                    errorMessage: errorMessage,
                    url: url,
                    lineNumber: lineNumber
                };
              var errorNotificationOverlayContainer = new ErrorNotificationOverlayContainer(errorObject);
                _this.addContainerChild(errorNotificationOverlayContainer, "body");
            }

        return false;
        };
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ApplicationContainer", ApplicationContainer);
