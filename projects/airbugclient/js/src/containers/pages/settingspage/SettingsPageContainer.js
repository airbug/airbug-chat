//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('SettingsPageContainer')

//@Require('Class')
//@Require('ClearChange')
//@Require('Exception')
//@Require('RemovePropertyChange')
//@Require('SetPropertyChange')
//@Require('airbug.AccountDropdownButtonContainer')
//@Require('airbug.ApplicationContainer')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.CommandModule')
//@Require('airbug.HomeButtonContainer')
//@Require('airbug.LinkView')
//@Require('airbug.MultiColumnView')
//@Require('airbug.NavListDividerView')
//@Require('airbug.NavListHeaderView')
//@Require('airbug.NavListItemView')
//@Require('airbug.NavListView')
//@Require('airbug.PageView')
//@Require('airbug.PanelView')
//@Require('airbug.TwoColumnView')
//@Require('airbug.UserNameView')
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                               = bugpack.require('Class');
var ClearChange                         = bugpack.require('ClearChange');
var Exception                           = bugpack.require('Exception');
var RemovePropertyChange                = bugpack.require('RemovePropertyChange');
var SetPropertyChange                   = bugpack.require('SetPropertyChange');
var AccountDropdownButtonContainer      = bugpack.require('airbug.AccountDropdownButtonContainer');
var ApplicationContainer                = bugpack.require('airbug.ApplicationContainer');
var ButtonViewEvent                     = bugpack.require('airbug.ButtonViewEvent');
var CommandModule                       = bugpack.require('airbug.CommandModule');
var HomeButtonContainer                 = bugpack.require('airbug.HomeButtonContainer');
var LinkView                            = bugpack.require('airbug.LinkView');
var MultiColumnView                     = bugpack.require('airbug.MultiColumnView');
var NavListDividerView                  = bugpack.require('airbug.NavListDividerView');
var NavListHeaderView                   = bugpack.require('airbug.NavListHeaderView');
var NavListItemView                     = bugpack.require('airbug.NavListItemView');
var NavListView                         = bugpack.require('airbug.NavListView');
var PageView                            = bugpack.require('airbug.PageView');
var PanelView                           = bugpack.require('airbug.PanelView');
var TwoColumnView                       = bugpack.require('airbug.TwoColumnView');
var UserNameView                        = bugpack.require('airbug.UserNameView');
var BugMeta                             = bugpack.require('bugmeta.BugMeta');
var AutowiredAnnotation                 = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation                  = bugpack.require('bugioc.PropertyAnnotation');
var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired                           = AutowiredAnnotation.autowired;
var bugmeta                             = BugMeta.context();
var CommandType                         = CommandModule.CommandType;
var property                            = PropertyAnnotation.property;
var view                                = ViewBuilder.view;


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
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {DocumentUtil}
         */
        this.documentUtil                           = null;


        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AccountDropdownButtonContainer}
         */
        this.accountDropdownButtonContainer         = null;


        /**
         * @private
         * @type {HomeButtonContainer}
         */
        this.homeButtonContainer                    = null;


        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CurrentUserModel}
         */
        this.currentUserModel                       = null;


        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @type {CommandModule}
         */
        this.commandModule                          = null;

        /**
         * @type {NavigationModule}
         */
        this.navigationModule                       = null;

        /**
         * @type {CurrentUserManagerModule}
         */
        this.currentUserManagerModule               = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {NavListItemView}
         */
        this.accountListItemView                    = null;

        /**
         * @private
         * @type {NavListItemView}
         */
        this.emailListItemView                      = null;

        /**
         * @private
         * @type {NavListItemView}
         */
        this.notificationListItemView               = null;

        /**
         * @protected
         * @type {PageView}
         */
        this.pageView                               = null;

        /**
         * @private
         * @type {NavListItemView}
         */
        this.profileListItemView                    = null;

        /**
         * @private
         * @type {TwoColumnView}
         */
        this.twoColumnView                          = null;
    },

    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {NavListItemView}
     */
    getAccountListItemView: function() {
        return this.accountListItemView;
    },

    /**
     * @return {CurrentUserModel}
     */
    getCurrentUserModel: function() {
        return this.currentUserModel;
    },

    /**
     * @return {NavListItemView}
     */
    getEmailListItemView: function() {
        return this.emailListItemView;
    },

    /**
     * @return {NavListItemView}
     */
    getNotificationListItemView: function() {
        return this.notificationListItemView;
    },

    /**
     * @return {NavListItemView}
     */
    getProfileListItemView: function() {
        return this.profileListItemView;
    },

    /**
     * @return {TwoColumnView}
     */
    getTwoColumnView: function() {
        return this.twoColumnView;
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
        this.loadCurrentUser();
    },

    /**
     * @protected
     */
    createContainer: function(routingArgs) {
        this._super(routingArgs);


        // Create Models
        //-------------------------------------------------------------------------------

        this.currentUserModel   = this.currentUserManagerModule.generateCurrentUserModel();


        // Create Views
        //-------------------------------------------------------------------------------

        view(PageView)
            .name("pageView")
            .children([
                view(TwoColumnView)
                    .name("twoColumnView")
                    .attributes({
                        configuration: TwoColumnView.Configuration.THICK_RIGHT_WITH_OFFSET_2,
                        rowStyle: MultiColumnView.RowStyle.FLUID
                    })
                    .children([
                        view(PanelView)
                            .appendTo("#column1of2-{{cid}}")
                            .children([
                                view(NavListView)
                                    .appendTo("#panel-body-{{cid}}")
                                    .children([
                                        view(NavListHeaderView)
                                            .appendTo("#nav-list-{{cid}}")
                                            .children([
                                                view(UserNameView)
                                                    .model(this.currentUserModel)
                                                    .attributes({classes: "text-simple"})
                                                    .appendTo("#nav-list-header-{{cid}}")
                                            ]),
                                        view(NavListDividerView)
                                            .appendTo("#nav-list-{{cid}}"),
                                        view(NavListItemView)
                                            .name("profileListItemView")
                                            .appendTo("#nav-list-{{cid}}")
                                            .children([
                                                view(LinkView)
                                                    .appendTo("#nav-list-item-{{cid}}")
                                                    .attributes({
                                                        href: "#settings/profile",
                                                        text: "Profile"
                                                    })
                                            ]),
                                        view(NavListItemView)
                                            .name("accountListItemView")
                                            .appendTo("#nav-list-{{cid}}")
                                            .children([
                                                view(LinkView)
                                                    .appendTo("#nav-list-item-{{cid}}")
                                                    .attributes({
                                                        href: "#settings/account",
                                                        text: "Account"
                                                    })
                                            ]),
                                        view(NavListItemView)
                                            .name("emailListItemView")
                                            .appendTo("#nav-list-{{cid}}")
                                            .children([
                                                view(LinkView)
                                                    .appendTo("#nav-list-item-{{cid}}")
                                                    .attributes({
                                                        href: "#settings/email",
                                                        text: "Emails"
                                                    })
                                            ]),
                                        view(NavListItemView)
                                            .name("notificationListItemView")
                                            .appendTo("#nav-list-{{cid}}")
                                            .children([
                                                view(LinkView)
                                                    .appendTo("#nav-list-item-{{cid}}")
                                                    .attributes({
                                                        href: "#settings/notification",
                                                        text: "Notifications"
                                                    })
                                            ])
                                    ])
                            ])
                    ])
            ])
            .build(this);


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.getApplicationView().addViewChild(this.pageView, "#application-{{cid}}");
    },

    /**
     * @protected
     */
    createContainerChildren: function(routingArgs) {
        this._super(routingArgs);
        this.homeButtonContainer                    = new HomeButtonContainer();
        this.accountDropdownButtonContainer         = new AccountDropdownButtonContainer();

        this.addContainerChild(this.accountDropdownButtonContainer, "#header-right");
        this.addContainerChild(this.homeButtonContainer,            "#header-left");
    },

    /**
     * @protected
     */
    deinitializeContainer: function() {
        this._super();

    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();

    },


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    loadCurrentUser: function() {
        var _this = this;
        this.currentUserManagerModule.retrieveCurrentUser(function(throwable, currentUser) {
            if (!throwable) {
                _this.currentUserModel.setCurrentUserMeldDocument(currentUser.getMeldDocument());
            } else {
                if (Class.doesExtend(throwable, Exception)) {
                    _this.commandModule.relayCommand(CommandType.FLASH.EXCEPTION, {message: throwable.getMessage()});
                } else {
                    _this.commandModule.relayCommand(CommandType.FLASH.ERROR, {message: "Sorry an error has occurred" + throwable});
                }
            }
        });
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(SettingsPageContainer).with(
    autowired().properties([
        property("commandModule").ref("commandModule"),
        property("currentUserManagerModule").ref("currentUserManagerModule"),
        property("documentUtil").ref("documentUtil"),
        property("navigationModule").ref("navigationModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.SettingsPageContainer", SettingsPageContainer);
