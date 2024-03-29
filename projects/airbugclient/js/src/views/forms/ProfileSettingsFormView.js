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

//@Export('airbug.ProfileSettingsFormView')

//@Require('Class')
//@Require('carapace.FormView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var FormView        = bugpack.require('carapace.FormView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ProfileSettingsFormView = Class.extend(FormView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:
        '<form id="profile-settings-form-{{cid}}" class="{{classes}} settings-form profile-settings-form">' +
            '<fieldset>' +
                '<label for="input-first-name-{{cid}}">First Name</label>' +
                '<input id="input-first-name-{{cid}}" class="input-xxlarge" type="text" name="firstName" placeholder="First Name" value="{{model.firstName}}">' +
            '</fieldset>' +
            '<fieldset>' +
                '<label for="input-last-name-{{cid}}">Last Name</label>' +
                '<input id="input-last-name-{{cid}}" class="input-xxlarge" type="text" name="lastName" placeholder="Last Name" value="{{model.lastName}}">' +
            '</fieldset>' +
            '<fieldset>' +
                '<button id="update-button-{{cid}}" type="submit" class="btn submit-button">Update Profile</button>' +
            '</fieldset>' +
        '</form>',


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {jQuery}
     */
    getInputFirstNameElement: function() {
        return this.findElement("#input-first-name-{{cid}}");
    },

    /**
     * @return {jQuery}
     */
    getInputLastNameElement: function() {
        return this.findElement("#input-last-name-{{cid}}");
    },


    //-------------------------------------------------------------------------------
    // CarapaceView Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {string} propertyName
     * @param {*} propertyValue
     */
    renderModelProperty: function(propertyName, propertyValue) {
        this._super(propertyName, propertyValue);

        //TODO BRN: If the user has entered new values for either of these properties (e.g. has filled out the form) we do not want to update the value

        switch (propertyName) {
            case "firstName":
                this.getInputFirstNameElement().val(propertyValue);
                break;
            case "lastName":
                this.getInputLastNameElement().val(propertyValue);
                break;
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ProfileSettingsFormView", ProfileSettingsFormView);
