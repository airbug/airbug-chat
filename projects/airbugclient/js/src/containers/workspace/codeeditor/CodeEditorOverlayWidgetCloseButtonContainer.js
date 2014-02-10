//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('CodeEditorOverlayWidgetCloseButtonContainer')

//@Require('Class')
//@Require('airbug.ButtonContainer')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.CommandModule')
//@Require('airbug.NakedButtonView')
//@Require('airbug.IconView')
//@Require('airbug.TextView')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var ButtonContainer         = bugpack.require('airbug.ButtonContainer');
var ButtonViewEvent         = bugpack.require('airbug.ButtonViewEvent');
var CommandModule           = bugpack.require('airbug.CommandModule');
var NakedButtonView         = bugpack.require('airbug.NakedButtonView');
var IconView                = bugpack.require('airbug.IconView');
var TextView                = bugpack.require('airbug.TextView');
var ViewBuilder             = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var CommandType             = CommandModule.CommandType;
var view                    = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {ButtonContainer}
 */
var CodeEditorOverlayWidgetCloseButtonContainer = Class.extend(ButtonContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    _constructor: function() {

        this._super("code-editor-fullscreen-close-button");


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {NakedButtonView}
         */
        this.buttonView         = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function() {
        this._super();

        // Create Views
        //-------------------------------------------------------------------------------

        this.buttonView =
            view(NakedButtonView)
                .attributes({
                    size: NakedButtonView.Size.SMALL
                })
                .children([
                    view(IconView)
                        .attributes({
                            type: IconView.Type.REMOVE
                        })
                        .appendTo('*[id|="button"]')
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.buttonView);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.buttonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearCodeEditorFullscreenCloseButtonClickedEvent, this);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {ButtonViewEvent} event
     */
    hearCodeEditorFullscreenCloseButtonClickedEvent: function(event) {
        this.getCommandModule().relayCommand(CommandType.HIDE.CODE_EDITOR_FULLSCREEN, {});
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CodeEditorOverlayWidgetCloseButtonContainer", CodeEditorOverlayWidgetCloseButtonContainer);
