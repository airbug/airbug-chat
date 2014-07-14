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

//@Export('airbug.UserStatusIndicatorView')

//@Require('Class')
//@Require('airbug.UserDefines')
//@Require('carapace.MustacheView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var UserDefines     = bugpack.require('airbug.UserDefines');
    var MustacheView    = bugpack.require('carapace.MustacheView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MustacheView}
     */
    var UserStatusIndicatorView = Class.extend(MustacheView, {

        _name: "airbug.UserStatusIndicatorView",


        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:   '<span id="user-status-indicator-{{cid}}" class="user-status-indicator {{classes}}"></span>',


        //-------------------------------------------------------------------------------
        // BugView Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {string} propertyName
         * @param {*} propertyValue
         */
        renderModelProperty: function(propertyName, propertyValue) {
            this._super(propertyName, propertyValue);
            switch (propertyName) {
                case "status":
                    this.renderStatus(propertyValue);
                    break;
            }
        },


        //-------------------------------------------------------------------------------
        // MustacheView Implementation
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @return {Object}
         */
        generateTemplateData: function() {
            var data = this._super();
            data.classes += this.generateStatusClass(this.getModel().getProperty("status"));
            return data;
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {string} status
         * @return {string}
         */
        generateStatusClass: function(status) {
            switch (status) {
                case UserDefines.Status.ACTIVE:
                case UserDefines.Status.HEADSDOWN:
                case UserDefines.Status.OFFLINE:
                    return "user-status-indicator-" + status;
            }
            return "";
        },

        /**
         * @private
         * @param {string} status
         */
        renderStatus: function(status) {
            var removeClasses = [
                this.generateStatusClass(UserDefines.Status.ACTIVE),
                this.generateStatusClass(UserDefines.Status.HEADSDOWN),
                this.generateStatusClass(UserDefines.Status.OFFLINE)
            ];
            this.findElement('#user-status-indicator-' + this.getCid())
                .removeClass(removeClasses.join(" "))
                .addClass(this.generateStatusClass(status));
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.UserStatusIndicatorView", UserStatusIndicatorView);
});
