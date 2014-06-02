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
//@Require('airbug.BoxWithHeaderAndFooterView')
//@Require('airbug.LoginFormContainer')
//@Require('airbug.PageView')
//@Require('airbug.PanelView')
//@Require('airbug.SignupButtonContainer')
//@Require('airbug.TextView')
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

    var Class                           = bugpack.require('Class');
    var AlternateLoginPanelContainer    = bugpack.require('airbug.AlternateLoginPanelContainer');
    var ApplicationContainer            = bugpack.require('airbug.ApplicationContainer');
    var BoxWithHeaderAndFooterView      = bugpack.require('airbug.BoxWithHeaderAndFooterView');
    var LoginFormContainer              = bugpack.require('airbug.LoginFormContainer');
    var PageView                        = bugpack.require('airbug.PageView');
    var PanelView                       = bugpack.require('airbug.PanelView');
    var SignupButtonContainer           = bugpack.require('airbug.SignupButtonContainer');
    var TextView                        = bugpack.require('airbug.TextView');
    var BugMeta                         = bugpack.require('bugmeta.BugMeta');
    var AutowiredTag             = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag              = bugpack.require('bugioc.PropertyTag');
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
