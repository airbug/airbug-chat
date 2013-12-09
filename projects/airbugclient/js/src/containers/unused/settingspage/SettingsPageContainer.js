//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('SettingsPageContainer')

//@Require('Class')
//@Require('airbug.ApplicationContainer')
//@Require('airbug.BackButtonContainer')
//@Require('airbug.BoxView')
//@Require('airbug.PageView')
//@Require('airbug.SettingsPanelContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =                     bugpack.require('Class');
var ApplicationContainer =      bugpack.require('airbug.ApplicationContainer');
var BackButtonContainer =       bugpack.require('airbug.BackButtonContainer');
var BoxView =                   bugpack.require('airbug.BoxView');
var PageView =                  bugpack.require('airbug.PageView');
var SettingsPanelContainer =    bugpack.require('airbug.SettingsPanelContainer');
var ViewBuilder =               bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SettingsPageContainer = Class.extend(ApplicationContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Views
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @type {PageView}
         */
        this.pageView = null;


        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @type {BackButtonContainer}
         */
        this.backButtonContainer = null;

        /**
         * @protected
         * @type {SettingsPanelContainer}
         */
        this.settingsPanelContainer = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Views
        //-------------------------------------------------------------------------------

        this.pageView =
            view(PageView)
                .children([
                    view(BoxView)
                        .attributes({classes: "settings-box"})
                        .appendTo('*[id|="page"]')
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.applicationView.addViewChild(this.pageView, "#application-" + this.applicationView.cid);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.backButtonContainer = new BackButtonContainer();
        this.settingsPanelContainer = new SettingsPanelContainer();
        this.addContainerChild(this.backButtonContainer, "#header-left");
        this.addContainerChild(this.settingsPanelContainer, '*[id|="box"]');
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.SettingsPageContainer", SettingsPageContainer);
