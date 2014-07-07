/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.SettingsPageContainer')

//@Require('Class')
//@Require('ClearChange')
//@Require('Exception')
//@Require('RemovePropertyChange')
//@Require('SetPropertyChange')
//@Require('airbug.AccountDropdownButtonContainer')
//@Require('airbug.ApplicationContainer')
//@Require('carapace.ButtonViewEvent')
//@Require('airbug.CommandModule')
//@Require('airbug.CurrentUserModel')
//@Require('airbug.HomeButtonContainer')
//@Require('carapace.LinkView')
//@Require('carapace.MultiColumnView')
//@Require('carapace.NavListDividerView')
//@Require('carapace.NavListHeaderView')
//@Require('carapace.NavListItemView')
//@Require('carapace.NavListView')
//@Require('carapace.PageView')
//@Require('carapace.PanelView')
//@Require('carapace.TwoColumnView')
//@Require('airbug.UserNameView')
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('carapace.ModelBuilder')
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
    var AccountDropdownButtonContainer      = bugpack.require('airbug.AccountDropdownButtonContainer');
    var ApplicationContainer                = bugpack.require('airbug.ApplicationContainer');
    var ButtonViewEvent                     = bugpack.require('carapace.ButtonViewEvent');
    var CommandModule                       = bugpack.require('airbug.CommandModule');
    var CurrentUserModel                    = bugpack.require('airbug.CurrentUserModel');
    var HomeButtonContainer                 = bugpack.require('airbug.HomeButtonContainer');
    var LinkView                            = bugpack.require('carapace.LinkView');
    var MultiColumnView                     = bugpack.require('carapace.MultiColumnView');
    var NavListDividerView                  = bugpack.require('carapace.NavListDividerView');
    var NavListHeaderView                   = bugpack.require('carapace.NavListHeaderView');
    var NavListItemView                     = bugpack.require('carapace.NavListItemView');
    var NavListView                         = bugpack.require('carapace.NavListView');
    var PageView                            = bugpack.require('carapace.PageView');
    var PanelView                           = bugpack.require('carapace.PanelView');
    var TwoColumnView                       = bugpack.require('carapace.TwoColumnView');
    var UserNameView                        = bugpack.require('airbug.UserNameView');
    var BugMeta                             = bugpack.require('bugmeta.BugMeta');
    var AutowiredTag                 = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag                  = bugpack.require('bugioc.PropertyTag');
    var ModelBuilder                        = bugpack.require('carapace.ModelBuilder');
    var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired                           = AutowiredTag.autowired;
    var bugmeta                             = BugMeta.context();
    var CommandType                         = CommandModule.CommandType;
    var model                               = ModelBuilder.model;
    var property                            = PropertyTag.property;
    var view                                = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ApplicationContainer}
     */
    var SettingsPageContainer = Class.extend(ApplicationContainer, {

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

            model(CurrentUserModel)
                .name("currentUserModel")
                .build(this);


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

    bugmeta.tag(SettingsPageContainer).with(
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
});
