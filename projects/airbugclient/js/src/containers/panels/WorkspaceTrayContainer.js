//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('WorkspaceTrayContainer')

//@Require('Class')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.CodeEditorTrayButtonContainer')
//@Require('airbug.CommandModule')
//@Require('airbug.IconView')
//@Require('airbug.ListView')
//@Require('airbug.TextView')
//@Require('airbug.PanelView')
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var ButtonViewEvent                 = bugpack.require('airbug.ButtonViewEvent');
var CodeEditorTrayButtonContainer   = bugpack.require('airbug.CodeEditorTrayButtonContainer');
var CommandModule                   = bugpack.require('airbug.CommandModule');
var IconView                        = bugpack.require('airbug.IconView');
var TextView                        = bugpack.require('airbug.TextView');
var PanelView                       = bugpack.require('airbug.PanelView');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var AutowiredAnnotation             = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation              = bugpack.require('bugioc.PropertyAnnotation');
var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var CommandType                     = CommandModule.CommandType;
var bugmeta                         = BugMeta.context();
var autowired                       = AutowiredAnnotation.autowired;
var property                        = PropertyAnnotation.property;
var view                            = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var WorkspaceTrayContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Models
        //-------------------------------------------------------------------------------


        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CommandModule}
         */
        this.commandModule              = null;

        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {PanelView}
         */
        this.panelView                  = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<*>} routerArgs
     */
    activateContainer: function(routerArgs) {
        this._super(routerArgs);
    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------


        // Create Views
        //-------------------------------------------------------------------------------

        this.panelView =
            view(PanelView)
                .attributes({})
                .children([
                    view(ButtonView)
                        .id("code-editor-button")
                        .attributes({size: ButtonView.Size.LARGE, type: "primary", align: "center"})
                        .children([
                            view(TextView)
                                .attributes({text:'<C/>'})
                                .appendTo("#code-editor-button")
                        ])
                        .appendTo('*[id|="panel-body"]'),
                    view(ButtonView)
                        .id("image-markup-button")
                        .attributes({size: ButtonView.Size.LARGE, type: "primary", align: "center"})
                        .children([
                            view(IconView)
                                .attributes({
                                    type: IconView.Type.PICTURE,
                                    color: IconView.Color.WHITE
                                })
                                .appendTo("#image-markup-button")
                        ])
                        .appendTo('*[id|="panel-body"]'),
                    view(ButtonView)
                        .id("git-button")
                        .attributes({size: ButtonView.Size.LARGE, type: "primary", align: "center"})
                        .children([
                            view(TextView)
                                .attributes({text:'git'})
                                .appendTo("#git-button")
                        ])
                        .appendTo('*[id|="panel-body"]')
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.panelView);
        this.codeEditorButtonView = this.findViewById("code-editor-button");
    },

    /**
     *
     */
    createContainerChildren: function() {
        this._super();
        this.codeEditorTrayButtonContainer = new CodeEditorTrayButtonContainer();
//        this.addContainerChild(this.codeEditorTrayButtonContainer, "#list-item-code-editor");
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.codeEditorButtonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearCodeEditorButtonClickedEvent, this);
//        this.codeEditorTrayButtonContainer.getViewTop().addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearTrayButtonClickedEvent, this);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    hearCodeEditorButtonClickedEvent: function(event) {
        this.commandModule.relayCommand(CommandType.DISPLAY.CODE_EDITOR, {});
        this.commandModule.relayCommand(CommandType.TOGGLE.WORKSPACE, {});
    },

    /**
     * @private
     * @param {airbug.ButtonViewEvent} event
     * NOTE: event.data @type {{buttonName: string}}
     */
    hearTrayButtonClickedEvent: function(event) {
        this.panelView.dispatchEvent(event);
        var parentContainer = this.getContainerParent(); //workspaceWidget
        var grandparentContainer = parentContainer.getContainerParent();
    }
});
bugmeta.annotate(WorkspaceTrayContainer).with(
    autowired().properties([
        property("commandModule").ref("commandModule"),
    ])
);

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.WorkspaceTrayContainer", WorkspaceTrayContainer);
