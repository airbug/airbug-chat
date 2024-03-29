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

//@Export('airbug.DialogueNameView')

//@Require('Class')
//@Require('carapace.MustacheView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var MustacheView    = bugpack.require('carapace.MustacheView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var DialogueNameView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<span id="dialogue-name-{{cid}}" class="dialogue-name text {{classes}}">Conversation with {{model.firstName}} {{model.lastName}}</span>',


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {jQuery}
     */
    getDialogueNameElement: function() {
        return this.findElement("#dialogue-name-{{cid}}");
    },


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
            case "firstName":
            case "lastName":
                this.getDialogueNameElement().text("Conversation with " + this.model.getProperty("firstName") + " " + this.model.getProperty("lastName"));
                break;
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.DialogueNameView", DialogueNameView);
