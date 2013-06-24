//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RoomNamePanelContainer')

//@Require('Class')
//@Require('airbug.PanelView')
//@Require('airbug.RoomNameView')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =             bugpack.require('Class');
var PanelView =         bugpack.require('airbug.PanelView');
var RoomNameView =      bugpack.require('airbug.RoomNameView');
var CarapaceContainer = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder =       bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomNamePanelContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(roomModel) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {RoomModel}
         */
        this.roomModel = roomModel;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {PanelView}
         */
        this.panelView = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Views
        //-------------------------------------------------------------------------------

        this.panelView =
            view(PanelView)
                .children([
                    view(RoomNameView)
                        .model(this.roomModel)
                        .appendTo('*[id|="panel-body"]')
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.panelView);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomNamePanelContainer", RoomNamePanelContainer);
