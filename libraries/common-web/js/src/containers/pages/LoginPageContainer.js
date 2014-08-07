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

//@Export('airbug.LoginPageContainer')

//@Require('Class')
//@Require('airbug.AlternateLoginPanelContainer')
//@Require('airbug.ApplicationContainer')
//@Require('airbug.LoginFormContainer')
//@Require('airbug.SignupButtonContainer')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('carapace.BoxWithHeaderAndFooterView')
//@Require('carapace.PageView')
//@Require('carapace.PanelView')
//@Require('carapace.TextView')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                           = bugpack.require('Class');
    var AlternateLoginPanelContainer    = bugpack.require('airbug.AlternateLoginPanelContainer');
    var ApplicationContainer            = bugpack.require('airbug.ApplicationContainer');
    var LoginFormContainer              = bugpack.require('airbug.LoginFormContainer');
    var SignupButtonContainer           = bugpack.require('airbug.SignupButtonContainer');
    var AutowiredTag                    = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag                     = bugpack.require('bugioc.PropertyTag');
    var BugMeta                         = bugpack.require('bugmeta.BugMeta');
    var BoxWithHeaderAndFooterView      = bugpack.require('carapace.BoxWithHeaderAndFooterView');
    var PageView                        = bugpack.require('carapace.PageView');
    var PanelView                       = bugpack.require('carapace.PanelView');
    var TextView                        = bugpack.require('carapace.TextView');
    var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                         = BugMeta.context();
    var autowired                       = AutowiredTag.autowired;
    var property                        = PropertyTag.property;
    var view                            = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ApplicationContainer}
     */
    var LoginPageContainer = Class.extend(ApplicationContainer, {

        _name: "airbug.LoginPageContainer",


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
            this.documentUtil                   = null;


            // Modules
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {NavigationModule}
             */
            this.navigationModule               = null;


            // Views
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {BoxWithHeaderAndFooterView}
             */
            this.boxView                        = null;

            /**
             * @protected
             * @type {PageView}
             */
            this.pageView                       = null;


            // Containers
            //-------------------------------------------------------------------------------

            /**
             * @protected
             * @type {AlternateLoginPanelContainer}
             */
            this.alternateLoginPanelContainer   = null;

            /**
             * @protected
             * @type {LoginFormContainer}
             */
            this.loginFormContainer             = null;

            /**
             * @protected
             * @type {SignupButtonContainer}
             */
            this.signupButtonContainer          = null;
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
            this.documentUtil.setTitle("Login - airbug");
        },

        /**
         * @protected
         */
        createContainer: function(routingArgs) {
            this._super();

            // Create Views
            //-------------------------------------------------------------------------------

            view(PageView)
                .name("pageView")
                .children([
                    view(BoxWithHeaderAndFooterView)
                        .name("boxView")
                        .attributes({classes: "login-box"})
                        .appendTo("#page-{{cid}}")
                        .children([
                            view(PanelView)
                                .appendTo('#box-header-{{cid}}')
                                .children([
                                    view(TextView)
                                        .attributes({
                                            text: "Login to airbug",
                                            classes: "login-header-text"
                                        })
                                        .appendTo("#panel-body-{{cid}}")
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
        createContainerChildren: function() {
            this._super();

            this.alternateLoginPanelContainer   = new AlternateLoginPanelContainer();
            this.loginFormContainer             = new LoginFormContainer();
            this.signupButtonContainer          = new SignupButtonContainer();
            this.addContainerChild(this.signupButtonContainer, "#header-right");
            this.addContainerChild(this.loginFormContainer, "#box-body-" + this.boxView.getCid());
            this.addContainerChild(this.alternateLoginPanelContainer, "#box-footer-" + this.boxView.getCid());
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(LoginPageContainer).with(
        autowired().properties([
            property("documentUtil").ref("documentUtil"),
            property("navigationModule").ref("navigationModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.LoginPageContainer", LoginPageContainer);
});
