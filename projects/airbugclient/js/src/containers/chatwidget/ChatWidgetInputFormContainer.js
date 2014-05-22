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

//@Export('airbug.ChatWidgetInputFormContainer')

//@Require('Class')
//@Require('airbug.ButtonDropdownView')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.CheckBoxInputView')
//@Require('airbug.CommandModule')
//@Require('airbug.DivView')
//@Require('airbug.DropdownItemDividerView')
//@Require('airbug.DropdownItemView')
//@Require('airbug.DropdownViewEvent')
//@Require('airbug.FormControlGroupView')
//@Require('airbug.FormView')
//@Require('airbug.FormViewEvent')
//@Require('airbug.IconView')
//@Require('airbug.KeyBoardEvent')
//@Require('airbug.LabelView')
//@Require('airbug.MultiColumnView')
//@Require('airbug.NakedButtonDropdownView')
//@Require('airbug.NakedButtonView')
//@Require('airbug.TextAreaView')
//@Require('airbug.TextView')
//@Require('airbug.TwoColumnView')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                           = bugpack.require('Class');
    var ButtonDropdownView              = bugpack.require('airbug.ButtonDropdownView');
    var ButtonViewEvent                 = bugpack.require('airbug.ButtonViewEvent');
    var CheckBoxInputView               = bugpack.require('airbug.CheckBoxInputView');
    var CommandModule                   = bugpack.require('airbug.CommandModule');
    var DivView                         = bugpack.require('airbug.DivView');
    var DropdownItemDividerView         = bugpack.require('airbug.DropdownItemDividerView');
    var DropdownItemView                = bugpack.require('airbug.DropdownItemView');
    var DropdownViewEvent               = bugpack.require('airbug.DropdownViewEvent');
    var FormControlGroupView            = bugpack.require('airbug.FormControlGroupView');
    var FormView                        = bugpack.require('airbug.FormView');
    var FormViewEvent                   = bugpack.require('airbug.FormViewEvent');
    var IconView                        = bugpack.require('airbug.IconView');
    var KeyBoardEvent                   = bugpack.require('airbug.KeyBoardEvent');
    var LabelView                       = bugpack.require('airbug.LabelView');
    var MultiColumnView                 = bugpack.require('airbug.MultiColumnView');
    var NakedButtonDropdownView         = bugpack.require('airbug.NakedButtonDropdownView');
    var NakedButtonView                 = bugpack.require('airbug.NakedButtonView');
    var TextAreaView                    = bugpack.require('airbug.TextAreaView');
    var TextView                        = bugpack.require('airbug.TextView');
    var TwoColumnView                   = bugpack.require('airbug.TwoColumnView');
    var AutowiredAnnotation             = bugpack.require('bugioc.AutowiredAnnotation');
    var PropertyAnnotation              = bugpack.require('bugioc.PropertyAnnotation');
    var BugMeta                         = bugpack.require('bugmeta.BugMeta');
    var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
    var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired                       = AutowiredAnnotation.autowired;
    var bugmeta                         = BugMeta.context();
    var CommandType                     = CommandModule.CommandType;
    var property                        = PropertyAnnotation.property;
    var view                            = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CarapaceContainer}
     */
    var ChatWidgetInputFormContainer = Class.extend(CarapaceContainer, {

        _name: "airbug.ChatWidgetInputFormContainer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {MessagePartModel} messagePartModel
         */
        _constructor: function(messagePartModel) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {MessagePartModel}
             */
            this.messagePartModel               = messagePartModel;


            // Modules
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {CommandModule}
             */
            this.commandModule                  = null;

            /**
             * @private
             * @type {MessageHandlerModule}
             */
            this.messageHandlerModule           = null;


            // Views
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {FormView}
             */
            this.chatWidgetFormView             = null;

            /**
             * @private
             * @type {DropdownItemView}
             */
            this.chooseExistingItemView         = null;

            /**
             * @private
             * @type {TextView}
             */
            this.sendButtonTextView             = null;

            /**
             * @private
             * @type {ButtonView}
             */
            this.sendButtonView                 = null;

            /**
             * @private
             * @type {CheckBoxInputView}
             */
            this.submitOnEnterCheckBoxView      = null;

            /**
             * @private
             * @type {DropdownItemView}
             */
            this.takeScreenshotItemView         = null;

            /**
             * @private
             * @type {TextAreaView}
             */
            this.textAreaView                   = null;

            /**
             * @private
             * @type {TwoColumnView}
             */
            this.twoColumnView                  = null;

            /**
             * @private
             * @type {DropdownItemView}
             */
            this.uploadPhotoItemView            = null;
        },


        //-------------------------------------------------------------------------------
        // CarapaceContainer Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param routerArgs
         */
        activateContainer: function(routerArgs) {
            this._super(routerArgs);
            this.textAreaView.focus();
        },

        /**
         * @protected
         */
        createContainer: function() {
            this._super();

            // Create Views
            //-------------------------------------------------------------------------------

            view(TwoColumnView)
                .name("twoColumnView")
                .attributes({
                    classes: "chat-widget-input",
                    configuration: TwoColumnView.Configuration.THIN_RIGHT,
                    rowStyle: MultiColumnView.RowStyle.FLUID
                })
                .children([
                    view(FormView)
                        .name("chatWidgetFormView")
                        .attributes({
                            classes: "form-horizontal"
                        })
                        .appendTo("#column1of2-{{cid}}")
                        .children([
                            view(FormControlGroupView)
                                .attributes({
                                    classes: "control-group-textarea"
                                })
                                .children([
                                    view(DivView)
                                        .attributes({
                                            classes: "chat-widget-input-spacing"
                                        })
                                        .children([
                                            view(TextAreaView)
                                                .name("textAreaView")
                                                .attributes({
                                                    name: "text",
                                                    classes: "chat-widget-input-textarea"
                                                })
                                        ])
                                ]),
                            view(FormControlGroupView)
                                .attributes({
                                    classes: "control-group-checkbox"
                                })
                                .children([
                                    view(LabelView)
                                        .attributes({
                                            text: "Press enter to send",
                                            classes: "checkbox"
                                        })
                                        .children([
                                            view(CheckBoxInputView)
                                                .name("submitOnEnterCheckBoxView")
                                                .attributes({
                                                    checked: true
                                                })
                                        ])
                                ])
                        ]),
                    view(TwoColumnView)
                        .attributes({
                            configuration: TwoColumnView.Configuration.THICK_RIGHT,
                            rowStyle: MultiColumnView.RowStyle.FLUID
                        })
                        .appendTo("#column2of2-{{cid}}")
                        .children([
                            view(DivView)
                                .appendTo("#column1of2-{{cid}}")
                                .attributes({
                                    classes: "chat-widget-input-spacing chat-widget-input-button-wrapper"
                                })
                                .children([
                                    view(NakedButtonDropdownView)
                                        .attributes({
                                            buttonClasses: "btn-fill chat-widget-input-button",
                                            classes: "btn-fill",
                                            direction: ButtonDropdownView.DropDirection.UP
                                        })
                                        .children([
                                            view(IconView)
                                                .appendTo("#dropdown-button-{{cid}}")
                                                .attributes({
                                                    type: IconView.Type.CAMERA,
                                                    color: IconView.Color.BLACK
                                                }),
                                            view(DropdownItemView)
                                                .name("uploadPhotoItemView")
                                                .appendTo("#dropdown-list-{{cid}}")
                                                .children([
                                                    view(TextView)
                                                        .appendTo("#dropdown-item-{{cid}}")
                                                        .attributes({text: "Upload Photo"})
                                                ]),
                                            view(DropdownItemDividerView)
                                                .appendTo("#dropdown-list-{{cid}}"),
                                            view(DropdownItemView)
                                                .name("chooseExistingItemView")
                                                .appendTo("#dropdown-list-{{cid}}")
                                                .children([
                                                    view(TextView)
                                                        .appendTo("#dropdown-item-{{cid}}")
                                                        .attributes({text: "Choose Existing"})
                                                ]),
                                            view(DropdownItemDividerView)
                                                .appendTo("#dropdown-list-{{cid}}"),
                                            view(DropdownItemView)
                                                .name("takeScreenshotItemView")
                                                .appendTo("#dropdown-list-{{cid}}")
                                                .children([
                                                    view(TextView)
                                                        .appendTo("#dropdown-item-{{cid}}")
                                                        .attributes({text: "Take Screenshot"})
                                                ])
                                        ])
                                ]),
                            view(DivView)
                                .appendTo("#column2of2-{{cid}}")
                                .attributes({
                                    classes: "chat-widget-input-spacing chat-widget-input-button-wrapper"
                                })
                                .children([
                                    view(NakedButtonView)
                                        .name("sendButtonView")
                                        .attributes({
                                            classes: "btn-fill chat-widget-input-button"
                                        })
                                        .children([
                                            view(TextView)
                                                .name("sendButtonTextView")
                                                .attributes({
                                                    text: "Send"
                                                })
                                                .appendTo('#button-{{cid}}')
                                        ])
                                ])
                        ])
                ])
                .build(this);


            // Wire Up
            //-------------------------------------------------------------------------------

            this.setViewTop(this.twoColumnView);
            this.addModel(this.messagePartModel);
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();
            this.chooseExistingItemView.removeEventListener(DropdownViewEvent.EventType.DROPDOWN_SELECTED, this.hearChooseExistingItemDropdownSelected, this);
            this.takeScreenshotItemView.removeEventListener(DropdownViewEvent.EventType.DROPDOWN_SELECTED, this.hearTakeScreenshotItemDropdownSelected, this);
            this.uploadPhotoItemView.removeEventListener(DropdownViewEvent.EventType.DROPDOWN_SELECTED, this.hearUploadPhotoItemDropdownSelected, this);
            this.textAreaView.removeEventListener(KeyBoardEvent.EventTypes.KEY_PRESS, this.hearKeyPressEvent, this);
            this.textAreaView.removeEventListener(KeyBoardEvent.EventTypes.KEY_UP, this.hearKeyUpEvent, this);
            this.twoColumnView.removeEventListener(FormViewEvent.EventType.SUBMIT, this.hearFormSubmittedEvent, this);
            this.sendButtonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.hearSendButtonClickedEvent, this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.chooseExistingItemView.addEventListener(DropdownViewEvent.EventType.DROPDOWN_SELECTED, this.hearChooseExistingItemDropdownSelected, this);
            this.takeScreenshotItemView.addEventListener(DropdownViewEvent.EventType.DROPDOWN_SELECTED, this.hearTakeScreenshotItemDropdownSelected, this);
            this.uploadPhotoItemView.addEventListener(DropdownViewEvent.EventType.DROPDOWN_SELECTED, this.hearUploadPhotoItemDropdownSelected, this);
            this.textAreaView.addEventListener(KeyBoardEvent.EventTypes.KEY_PRESS, this.hearKeyPressEvent, this);
            this.textAreaView.addEventListener(KeyBoardEvent.EventTypes.KEY_UP, this.hearKeyUpEvent, this);
            this.twoColumnView.addEventListener(FormViewEvent.EventType.SUBMIT, this.hearFormSubmittedEvent, this);
            this.sendButtonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearSendButtonClickedEvent, this);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @return {Object}
         */
        getFormData: function() {
            return this.chatWidgetFormView.getFormData();
        },

        /**
         * @private
         * @param {KeyBoardEvent} event
         */
        processEnterKeyEvent: function(event) {
            var ctl             = event.getControlKey();
            var shift           = event.getShiftKey();
            var submitOnEnter   = this.submitOnEnterCheckBoxView.isChecked();
            if (submitOnEnter) {
                if (!ctl && !shift) {
                    this.relayChatMessage();
                } else {
                    this.insertLineBreak();
                }
            } else {
                if (ctl || shift) {
                    this.relayChatMessage();
                } else {
                    this.insertLineBreak();
                }
            }
        },

        /**
         * @protected
         */
        relayChatMessage: function() {
            // currently only supports text chatmessages via this function
            var formData = this.getFormData();
            if (/\S/.test(formData.text) || this.messagePartModel.getProperty("type")) {
                var chatMessageData = {
                    type: "text",
                    body: {parts: [{
                        type: "text",
                        text: formData.text
                    }]}
                };
                if (this.messagePartModel && this.messagePartModel.getProperty("type")) {
                    chatMessageData.body.parts.push(this.messagePartModel.toLiteral());
                    chatMessageData.type = "multipart";
                }
                this.messageHandlerModule.sendMessage(chatMessageData);
                this.textAreaView.setValue("");
                this.messagePartModel.clear();
            }
        },

        /**
         * @protected
         */
        insertLineBreak: function() {
            var content     = this.textAreaView.getValue();
            var caret       = this.textAreaView.getCaret();
            this.textAreaView.setValue(content.substring(0, caret) +
                "\n" + content.substring(caret, content.length));
            this.textAreaView.setCaret(caret + 1);
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {DropdownViewEvent} event
         */
        hearChooseExistingItemDropdownSelected: function(event) {
            //TODO BRN: Show existing item modal
        },

        /**
         * @private
         * @param {DropdownViewEvent} event
         */
        hearTakeScreenshotItemDropdownSelected: function(event) {
            //TODO BRN: Determine if user has an open plugin connection
            //if so, send server command to take a screenshot
            //otherwise,
        },

        /**
         * @private
         * @param {DropdownViewEvent} event
         */
        hearUploadPhotoItemDropdownSelected: function(event) {
            this.commandModule.relayCommand(CommandType.DISPLAY.IMAGE_UPLOAD_MODAL, {});
        },

        /**
         * @private
         * @param {ButtonViewEvent} event
         */
        /*hearChooseOrUploadImageViewClickedEvent: function(event) {
            this.commandModule.relayCommand(CommandType.DISPLAY.IMAGE_UPLOAD, {});
        },*/

        /**
         * @private
         * @param {ButtonViewEvent} event
         */
        hearSendButtonClickedEvent: function(event) {
            // fires off FormViewEvent.EventType.SUBMIT
            // gets picked up by the hearFormSubmittedEvent event listener function
            this.commandModule.relayMessage(CommandModule.MessageType.BUTTON_CLICKED, {buttonName: "ChatWidgetInputFormSendButton"});
            this.relayChatMessage();
        },

        /**
         * @private
         * @param {FormViewEvent} event
         */
        hearFormSubmittedEvent: function(event) {
            this.relayChatMessage();
        },

        /**
         * @private
         * @param {KeyBoardEvent} event
         */
        hearKeyPressEvent: function(event) {
            var key     = event.getKeyCode();
            if (key === 13) {
                var htmlEvent = event.getData().event;
                htmlEvent.preventDefault();
                htmlEvent.stopPropagation();
            }
        },

        /**
         * @private
         * @param {KeyBoardEvent} event
         */
        hearKeyUpEvent: function(event) {
            var key     = event.getKeyCode();
            if (key === 13) {
                this.processEnterKeyEvent(event);
            } else {
                var formData  = this.getFormData();
                /*if (!/\S/.test(formData.text)) {
                    this.sendButtonTextView.setText("Ok");
                } else {
                    this.sendButtonTextView.setText("Send");
                }*/
            }
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(ChatWidgetInputFormContainer).with(
        autowired().properties([
            property("commandModule").ref("commandModule"),
            property("messageHandlerModule").ref("messageHandlerModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.ChatWidgetInputFormContainer", ChatWidgetInputFormContainer);
});
