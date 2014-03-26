//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ShareRoomTextView')

//@Require('Class')
//@Require('airbug.TextView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var TextView        = bugpack.require('airbug.TextView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ShareRoomTextView = Class.extend(TextView, {

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
            case "name":
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
        data.text           = this.generateText(this.getModel().getProperty("name"));
        return data;
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {string} roomName
     * @return {string}
     */
    generateText: function(roomName) {
        return "Share conversation \"" + roomName + "\"";
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ShareRoomTextView", ShareRoomTextView);
