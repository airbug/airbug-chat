//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ProfileSettingsPageContainer')

//@Require('Class')
//@Require('ClearChange')
//@Require('Exception')
//@Require('RemovePropertyChange')
//@Require('SetPropertyChange')
//@Require('airbug.PanelWithHeaderView')
//@Require('airbug.ProfileSettingsFormContainer')
//@Require('airbug.SettingsPageContainer')
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                               = bugpack.require('Class');
    var ClearChange                         = bugpack.require('ClearChange');
    var Exception                           = bugpack.require('Exception');
    var RemovePropertyChange                = bugpack.require('RemovePropertyChange');
    var SetPropertyChange                   = bugpack.require('SetPropertyChange');
    var PanelWithHeaderView                 = bugpack.require('airbug.PanelWithHeaderView');
    var ProfileSettingsFormContainer        = bugpack.require('airbug.ProfileSettingsFormContainer');
    var SettingsPageContainer               = bugpack.require('airbug.SettingsPageContainer');
    var BugMeta                             = bugpack.require('bugmeta.BugMeta');
    var AutowiredTag                 = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag                  = bugpack.require('bugioc.PropertyTag');
    var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired                           = AutowiredTag.autowired;
    var bugmeta                             = BugMeta.context();
    var property                            = PropertyTag.property;
    var view                                = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {SettingsPageContainer}
     */
    var ProfileSettingsPageContainer = Class.extend(SettingsPageContainer, {

        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            // Containers
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {ProfileSettingsFormContainer}
             */
            this.profileSettingsFormContainer   = null;


            // Views
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {PanelWithHeaderView}
             */
            this.panelWithHeaderView            = null;
        },


        //-------------------------------------------------------------------------------
        // CarapaceContainer Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {Array.<*>} routingArgs
         */
        activateContainer: function(routingArgs) {
            this._super(routingArgs);
            this.getProfileListItemView().setAttribute("active", true);
        },

        /**
         * @protected
         */
        createContainer: function(routingArgs) {
            this._super(routingArgs);


            // Create Views
            //-------------------------------------------------------------------------------

            view(PanelWithHeaderView)
                .name("panelWithHeaderView")
                .attributes({
                    headerTitle: "Public Profile"
                })
                .build(this);


            // Wire Up Views
            //-------------------------------------------------------------------------------

            this.getTwoColumnView().addViewChild(this.panelWithHeaderView, "#column2of2-{{cid}}");
        },

        /**
         * @protected
         */
        createContainerChildren: function(routingArgs) {
            this._super(routingArgs);
            this.profileSettingsFormContainer       = new ProfileSettingsFormContainer(this.getCurrentUserModel());
            this.addContainerChild(this.profileSettingsFormContainer, "#panel-body-" + this.panelWithHeaderView.getCid());
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(ProfileSettingsPageContainer).with(
        autowired().properties([

        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.ProfileSettingsPageContainer", ProfileSettingsPageContainer);
});
