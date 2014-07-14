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

//@Export('airbug.GithubLoginPageContainer')

//@Require('Class')
//@Require('airbug.AlternateLoginPanelContainer')
//@Require('airbug.ApplicationContainer')
//@Require('airbug.GithubLoginFormContainer')
//@Require('airbug.SignupButtonContainer')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('carapace.BoxWithFooterView')
//@Require('carapace.PageView')
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
    var GithubLoginFormContainer        = bugpack.require('airbug.GithubLoginFormContainer');
    var SignupButtonContainer           = bugpack.require('airbug.SignupButtonContainer');
    var AutowiredTag                    = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag                     = bugpack.require('bugioc.PropertyTag');
    var BugMeta                         = bugpack.require('bugmeta.BugMeta');
    var BoxWithFooterView               = bugpack.require('carapace.BoxWithFooterView');
    var PageView                        = bugpack.require('carapace.PageView');
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
    var GithubLoginPageContainer = Class.extend(ApplicationContainer, {

        _name: "airbug.GithubLoginPageContainer",


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
             * @type {BoxWithFooterView}
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
             * @type {GithubLoginFormContainer}
             */
            this.githubLoginFormContainer             = null;

            /**
             * @protected
             * @type {SignupButtonContainer}
             */
            this.signupButtonContainer          = null;
        },


        //-------------------------------------------------------------------------------
        // CarapaceController Extensions
        //-------------------------------------------------------------------------------

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
                    view(BoxWithFooterView)
                        .name("boxView")
                        .attributes({classes: "login-box"})
                        .appendTo("#page-{{cid}}")
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

            this.githubLoginFormContainer       = new GithubLoginFormContainer();
            this.signupButtonContainer          = new SignupButtonContainer();
            this.addContainerChild(this.signupButtonContainer, "#header-right");
            this.addContainerChild(this.githubLoginFormContainer, "#box-body-" + this.boxView.getCid());
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(GithubLoginPageContainer).with(
        autowired().properties([
            property("navigationModule").ref("navigationModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.GithubLoginPageContainer", GithubLoginPageContainer);
});
