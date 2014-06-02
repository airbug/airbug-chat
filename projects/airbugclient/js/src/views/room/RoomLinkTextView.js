//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.RoomLinkTextView')

//@Require('Class')
//@Require('airbug.TextView')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var TextView                    = bugpack.require('airbug.TextView');
var AutowiredTag         = bugpack.require('bugioc.AutowiredTag');
var PropertyTag          = bugpack.require('bugioc.PropertyTag');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');


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
