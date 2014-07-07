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

//@Export('airbug.SignupPageContainer')

//@Require('Class')
//@Require('airbug.ApplicationContainer')
//@Require('carapace.BoxWithHeaderView')
//@Require('airbug.LoginButtonContainer')
//@Require('carapace.PageView')
//@Require('carapace.PanelView')
//@Require('airbug.RegistrationFormContainer')
//@Require('carapace.TextView')
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
    var ApplicationContainer            = bugpack.require('airbug.ApplicationContainer');
    var BoxWithHeaderView               = bugpack.require('carapace.BoxWithHeaderView');
    var LoginButtonContainer            = bugpack.require('airbug.LoginButtonContainer');
    var PageView                        = bugpack.require('carapace.PageView');
    var PanelView                       = bugpack.require('carapace.PanelView');
    var RegistrationFormContainer       = bugpack.require('airbug.RegistrationFormContainer');
    var TextView                        = bugpack.require('carapace.TextView');
    var BugMeta                         = bugpack.require('bugmeta.BugMeta');
    var AutowiredTag             = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag              = bugpack.require('bugioc.PropertyTag');
    var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired                       = AutowiredTag.autowired;
    var bugmeta                         = BugMeta.context();
    var property                        = PropertyTag.property;
    var view                            = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ApplicationContainer}
     */
    var SignupPageContainer = Class.extend(ApplicationContainer, {

        _name: "airbug.SignupPageContainer",


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
             * @protected
             * @type {LoginButtonContainer}
             */
            this.loginButtonContainer       = null;

            /**
             * @protected
             * @type {RegistrationFormContainer}
             */
            this.registrationFormContainer  = null;


            // Views
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {BoxWithHeaderView}
             */
            this.boxView                    = null;

            /**
             * @protected
             * @type {PageView}
             */
            this.pageView                   = null;
        },


        //-------------------------------------------------------------------------------
        // CarapaceContainer Extensions
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {Array.<*>} routingArgs
         */
        activateContainer: function(routingArgs) {
            this._super(routingArgs);
            this.documentUtil.setTitle("Join - airbug");
        },

        /**
         * @protected
         */
        createContainer: function() {
            this._super();

            // Create Views
            //-------------------------------------------------------------------------------

            view(PageView)
                .name("pageView")
                .children([
                    view(BoxWithHeaderView)
                        .name("boxView")
                        .attributes({classes: "registration-box"})
                        .appendTo("#page-{{cid}}")
                        .children([
                            view(PanelView)
                                .appendTo("#box-header-{{cid}}")
                                .children([
                                    view(TextView)
                                        .attributes({
                                            text: "Join airbug",
                                            classes: "registration-header-text"
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
            this.loginButtonContainer       = new LoginButtonContainer();
            this.registrationFormContainer  = new RegistrationFormContainer();
            this.addContainerChild(this.loginButtonContainer, "#header-right");
            this.addContainerChild(this.registrationFormContainer, "#box-body-" + this.boxView.getCid());
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(SignupPageContainer).with(
        autowired().properties([
            property("documentUtil").ref("documentUtil")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.SignupPageContainer", SignupPageContainer);
});
