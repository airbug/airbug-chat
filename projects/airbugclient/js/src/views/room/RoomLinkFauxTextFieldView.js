//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.RoomLinkFauxTextFieldView')

//@Require('Class')
//@Require('TypeUtil')
//@Require('carapace.FauxTextFieldView')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var TypeUtil                    = bugpack.require('TypeUtil');
    var FauxTextFieldView           = bugpack.require('carapace.FauxTextFieldView');
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

    /**
     * @class
     * @extends {FauxTextFieldView}
     */
    var RoomLinkFauxTextFieldView = Class.extend(FauxTextFieldView, {

        _name: "airbug.RoomLinkFauxTextFieldView",


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
         * @return {Object}
         */
        generateTemplateData: function() {
            var data        = this._super();
            data.value      = this.generateText(this.getModel().getProperty("id"));
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

    bugmeta.tag(RoomLinkFauxTextFieldView).with(
        autowired().properties([
            property("windowUtil").ref("windowUtil")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.RoomLinkFauxTextFieldView", RoomLinkFauxTextFieldView);
});
