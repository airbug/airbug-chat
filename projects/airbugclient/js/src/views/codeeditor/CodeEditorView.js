//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.CodeEditorView')

//@Require('Class')
//@Require('ace.Ace')
//@Require('airbug.CodeEditorViewEvent')
//@Require('airbug.MustacheView')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                               = bugpack.require('Class');
    var Ace                                 = bugpack.require('ace.Ace');
    var CodeEditorViewEvent                 = bugpack.require('airbug.CodeEditorViewEvent');
    var MustacheView                        = bugpack.require('airbug.MustacheView');
    var AutowiredTag                 = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag                  = bugpack.require('bugioc.PropertyTag');
    var BugMeta                             = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired                           = AutowiredTag.autowired;
    var bugmeta                             = BugMeta.context();
    var property                            = PropertyTag.property;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MustacheView}
     */
    var CodeEditorView = Class.extend(MustacheView, {

        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        template:   '<div id="code-editor-{{cid}}" class="code-editor {{classes}}">' +
            '</div>',


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Object} options
         */
        _constructor: function(options) {

            this._super(options);

            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Ace}
             */
            this.editor                                 = null;


            // Modules
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {AirbugStaticConfig}
             */
            this.airbugStaticConfig                     = null;

            var _this = this;
            this.handleChangeSelection  = function(event) {
                _this.dispatchEvent(new CodeEditorViewEvent(CodeEditorViewEvent.EventType.SELECTION_CHANGED));
            }
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Ace}
         */
        getEditor: function() {
            return this.editor;
        },


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @returns {string}
         */
        getEditorCopyText: function() {
            return this.editor.getCopyText();
        },

        /**
         * @return {*}
         */
        getEditorCursorPosition: function() {
            return this.editor.getCursorPosition();
        },

        /**
         * @param {{
         *      column: number,
         *      row: number
         * }} cursorPosition
         */
        setEditorCursorPosition: function(cursorPosition) {
            this.editor.moveCursorToPosition(cursorPosition);
        },

        /**
         * @returns {Document} document
         */
        getEditorDocument: function() {
            return this.editor.getSession().getDocument();
        },

        /**
         * @param {Document} document
         */
        setEditorDocument: function(document) {
            this.editor.getSession().setDocument(document);
        },

        /**
         * @return {boolean}
         */
        getEditorDragEnabled: function() {
            return this.editor.getOption("dragEnabled");
        },

        /**
         * @param {boolean} dragEnabled
         */
        setEditorDragEnabled: function(dragEnabled) {
            this.editor.setOption("dragEnabled", dragEnabled)
        },

        /**
         * @return {number}
         */
        getEditorFontSize: function() {
            return this.editor.getFontSize();
        },

        /**
         * @param {number} fontSize
         */
        setEditorFontSize: function(fontSize) {
            this.editor.setFontSize(fontSize);
        },

        /**
         * @return {string}
         */
        getEditorLanguage: function() {
            var mode = this.editor.getSession().getMode().$id;
            return mode.substring(mode.lastIndexOf("/") + 1);
        },

        /**
         * @return {string}
         */
        getEditorMode: function() {
            return this.editor.getSession().getMode().$id;
        },

        /**
         * @param {string} mode
         */
        setEditorMode: function(mode) {
            this.editor.getSession().setMode(mode);
        },

        /**
         * @return {boolean}
         */
        getEditorShowInvisibles: function() {
            return this.editor.getOption("showInvisibles");
        },

        /**
         * @param {boolean} showInvisibles
         */
        setEditorShowInvisibles: function(showInvisibles) {
            this.editor.setOption("showInvisibles", showInvisibles);
        },

        /**
         * @return {number}
         */
        getEditorTabSize: function() {
            return this.editor.getSession().getTabSize();
        },

        /**
         * @param {number} tabSize
         */
        setEditorTabSize: function(tabSize) {
            this.editor.getSession().setTabSize(tabSize);
            console.log("tab size has been set to", this.editor.getSession().getTabSize()); //maybe make these into notifications
        },

        /**
         * @return {string}
         */
        getEditorTabType: function() {
            if (this.getEditorUseSoftTabs()) {
                return "soft";
            } else {
                return "hard";
            }
        },

        /**
         * @param {string} tabType
         */
        setEditorTabType: function(tabType) {
            var softTabs = false;
            if (tabType === "soft") {
                softTabs = true;
            }
            this.setEditorUseSoftTabs(softTabs);
        },

        /**
         * @return {string}
         */
        getEditorText: function() {
            if (this.editor) {
                return this.editor.getValue();
            } else {
                return "";
            }
        },

        /**
         * @param {string} value
         */
        setEditorText: function(value) {
            if (this.editor) {
                this.editor.setValue(value);
            }
        },

        /**
         * @return {string}
         */
        getEditorTheme: function() {
            return this.editor.getTheme();
        },

        /**
         * @param {string} theme
         */
        setEditorTheme: function(theme) {
            this.editor.setTheme(theme);
        },

        /**
         * @returns {boolean}
         */
        getEditorReadOnly: function() {
            return this.editor.getReadOnly();
        },

        /**
         * @param {boolean} readOnly
         */
        setEditorReadOnly: function(readOnly) {
            if (this.editor) {
                this.editor.setReadOnly(readOnly);
            }
        },

        /**
         * @return {boolean}
         */
        getEditorUseSoftTabs: function() {
            return this.editor.getSession().getUseSoftTabs();
        },

        /**
         * @param {boolean} useSoftTabs
         */
        setEditorUseSoftTabs: function(useSoftTabs) {
            this.editor.getSession().setUseSoftTabs(useSoftTabs);
        },

        /**
         *
         */
        resizeEditor: function() {
            this.editor.resize();
        },

        /**
         *
         */
        focusEditor: function() {
            this.editor.focus();
        },


        //-------------------------------------------------------------------------------
        // BugView Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        deinitializeView: function() {
            this._super();
            this.editor.selection.removeListener("changeSelection", this.handleChangeSelection);
        },

        /**
         * @protected
         */
        initializeView: function() {
            this._super();
            this.editor.selection.on("changeSelection", this.handleChangeSelection);
        },

        /**
         * @protected
         */
        destroyView: function() {
            this._super();
            this.editor.destroy();
            this.editor = null;
        },

        /**
         * @return {Element}
         */
        make: function() {
            var element = this._super();
            Ace.config.set("basePath", this.airbugStaticConfig.getStickyStaticUrl());
            this.editor          = Ace.edit(element[0]);
            return element;
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(CodeEditorView).with(
        autowired().properties([
            property("airbugStaticConfig").ref("airbugStaticConfig")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.CodeEditorView", CodeEditorView);
});
