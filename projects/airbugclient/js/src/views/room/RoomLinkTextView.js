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

//@Export('airbug.RoomLinkTextView')

//@Require('Class')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('carapace.TextView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var AutowiredTag         = bugpack.require('bugioc.AutowiredTag');
var PropertyTag          = bugpack.require('bugioc.PropertyTag');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var TextView                    = bugpack.require('carapace.TextView');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired                   = AutowiredTag.autowired;
var bugmeta                     = BugMeta.context();
var property                    = PropertyTag.property;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomLinkTextView = Class.extend(TextView, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(options) {

        this._super(options);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {WindowUtil}
         */
        this.windowUtil     = null;
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
            case "id":
                this.getTextElement().text(this.generateText(propertyValue));
                break;
        }
    },


    //-------------------------------------------------------------------------------
    // MustacheView Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @return {Object}
     */
    generateTemplateData: function() {
        var data            = this._super();
        data.text           = this.generateText(this.getModel().getProperty("id"));
        return data;
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {string} roomId
     */
    generateText: function(roomId) {
        var currentUrl = this.windowUtil.getUrl();
        return currentUrl + "#conversation/" + roomId;
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(RoomLinkTextView).with(
    autowired().properties([
        property("windowUtil").ref("windowUtil")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomLinkTextView", RoomLinkTextView);
