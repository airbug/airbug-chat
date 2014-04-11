//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.CodeEditorSettingsWidgetView')

//@Require('Class')
//@Require('airbug.FormViewEvent')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var FormViewEvent   = bugpack.require('airbug.FormViewEvent');
    var MustacheView    = bugpack.require('airbug.MustacheView');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MustacheView}
     */
    var CodeEditorSettingsWidgetView = Class.extend(MustacheView, {

        //-------------------------------------------------------------------------------
        // Template
        //-------------------------------------------------------------------------------

        // table id was controls and more-controls
        template:
            '<div id="code-editor-settings-widget-{{cid}}" class="workspace-widget box box-with-header">\
                <div id="box-header-{{cid}}" class="box-header workspace-widget-header">\
                </div>\
                <div id="box-body-{{cid}}" class="box-body">\
                    <label for="code-editor-mode-{{cid}}">Language</label>\
                    <select id="code-editor-mode-{{cid}}" size="1">\
                        <option value="ace/mode/c_cpp">         C           </option>\
                        <option value="ace/mode/csharp">        C#          </option>\
                        <option value="ace/mode/c_cpp">         C++         </option>\
                        <option value="ace/mode/coffee">        Coffee      </option>\
                        <option value="ace/mode/css">           CSS         </option>\
                        <option value="ace/mode/django">        Django      </option>\
                        <option value="ace/mode/rhtml">         erb         </option>\
                        <option value="ace/mode/golang">        Go          </option>\
                        <option value="ace/mode/haml">          HAML        </option>\
                        <option value="ace/mode/handlebars">    Handlebars  </option>\
                        <option value="ace/mode/html">          HTML        </option>\
                        <option value="ace/mode/jade">          Jade        </option>\
                        <option value="ace/mode/java">          Java        </option>\
                        <option value="ace/mode/javascript">    Javascript  </option>\
                        <option value="ace/mode/json">          json        </option>\
                        <option value="ace/mode/less">          LESS        </option>\
                        <option value="ace/mode/markdown">      Markdown    </option>\
                        <option value="ace/mode/matlab">        MATLAB      </option>\
                        <option value="ace/mode/mysql">         mySQL       </option>\
                        <option value="ace/mode/objectivec">    Objective-C </option>\
                        <option value="ace/mode/perl">          Perl        </option>\
                        <option value="ace/mode/php">           Php         </option>\
                        <option value="ace/mode/plain_text" selected="selected">    Plain Text  </option>\
                        <option value="ace/mode/pgsql">         PostgreSQL  </option>\
                        <option value="ace/mode/python">        Python      </option>\
                        <option value="ace/mode/r">             R           </option>\
                        <option value="ace/mode/rhtml">         rhtml       </option>\
                        <option value="ace/mode/ruby">          Ruby        </option>\
                        <option value="ace/mode/sass">          SASS        </option>\
                        <option value="ace/mode/scala">         Scala       </option>\
                        <option value="ace/mode/sql">           SQL         </option>\
                        <option value="ace/mode/text">          Text        </option>\
                        <option value="ace/mode/xml">           XML         </option>\
                        <option value="ace/mode/yaml">          YAML        </option>\
                    </select>\
                    <label for="code-editor-theme-{{cid}}">Theme</label>\
                    <select id="code-editor-theme-{{cid}}" size="1">\
                        <optgroup label="Bright">' +
                        //   <option value="ace/theme/chrome">Chrome</option>\
                        //   <option value="ace/theme/clouds">Clouds</option>\
                        //   <option value="ace/theme/crimson_editor">Crimson Editor</option>\
                        //   <option value="ace/theme/dawn">Dawn</option>\
                        //   <option value="ace/theme/dreamweaver">Dreamweaver</option>\
                        //   <option value="ace/theme/eclipse">Eclipse</option>\
                        //   <option value="ace/theme/github">GitHub</option>\
                        //   <option value="ace/theme/solarized_light">Solarized Light</option>\
                        '<option value="ace/theme/textmate">TextMate</option>' +
                        //   '<option value="ace/theme/tomorrow">Tomorrow</option>\
                        //   <option value="ace/theme/xcode">XCode</option>\
                        '</optgroup>\
                        <optgroup label="Dark">' +
                        //   <option value="ace/theme/ambiance">Ambiance</option>
                        //   <option value="ace/theme/chaos">Chaos</option>\
                        //   <option value="ace/theme/clouds_midnight">Clouds Midnight</option>\
                        //   <option value="ace/theme/cobalt">Cobalt</option>\
                        //   <option value="ace/theme/idle_fingers">idleFingers</option>\
                        //   <option value="ace/theme/kr_theme">krTheme</option>\
                        //   <option value="ace/theme/merbivore">Merbivore</option>\
                        //   <option value="ace/theme/merbivore_soft">Merbivore Soft</option>\
                        //   <option value="ace/theme/mono_industrial">Mono Industrial</option>\
                        //   <option value="ace/theme/monokai">Monokai</option>\
                        //   <option value="ace/theme/pastel_on_dark">Pastel on dark</option>\
                        //   <option value="ace/theme/solarized_dark">Solarized Dark</option>\
                        '<option value="ace/theme/twilight" selected="selected">Twilight</option>' +
                        //   <option value="ace/theme/tomorrow_night">Tomorrow Night</option>\
                        //   <option value="ace/theme/tomorrow_night_blue">Tomorrow Night Blue</option>\
                        //   <option value="ace/theme/tomorrow_night_bright">Tomorrow Night Bright</option>\
                        //   <option value="ace/theme/tomorrow_night_eighties">Tomorrow Night 80s</option>\
                        //   <option value="ace/theme/vibrant_ink">Vibrant Ink</option>\
                        '</optgroup>\
                      </select>' +
        //            <label for="code-editor-fontsize">Font Size</label>\
        //            <select id="code-editor-fontsize" size="1">\
        //              <option value="10">10px</option>\
        //              <option value="11">11px</option>\
        //              <option value="12" selected="selected">12px</option>\
        //              <option value="14">14px</option>\
        //              <option value="16">16px</option>\
        //              <option value="20">20px</option>\
        //              <option value="24">24px</option>\
        //            </select>\
                    '<label for="code-editor-tabsize-{{cid}}">Tab Size</label>\
                    <select id="code-editor-tabsize-{{cid}}" size="1">\
                        <option value="2">2 Spaces</option>\
                        <option value="4" selected="selected">4 Spaces</option>\
                    </select>\
                    <label for="code-editor-whitespace-{{cid}}">Show Whitespace</label>\
                    <select id="code-editor-whitespace-{{cid}}" size="1">\
                        <option value="true" selected="selected">true</option>\
                        <option value="false">false</option>\
                    </select>\
                </div>\
            </div>',


        //-------------------------------------------------------------------------------
        // CarapaceView Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        deinitializeView: function() {
            this._super();
            this.findElement("#code-editor-mode-{{cid}}").off();
            this.findElement("#code-editor-theme-{{cid}}").off();
            this.findElement("#code-editor-fontsize-{{cid}}").off();
            this.findElement("#code-editor-tabsize-{{cid}}").off();
        },

        /**
         * @protected
         */
        initializeView: function() {
            this._super();
            var _this = this;
            this.findElement("#code-editor-mode-{{cid}}").change(function(event) {
                _this.handleCodeEditorModeChangeEvent(event);
            });
            this.findElement("#code-editor-theme-{{cid}}").change(function(event) {
                _this.handleCodeEditorThemeChangeEvent(event);
            });
            this.findElement("#code-editor-fontsize-{{cid}}").change(function(event) {
                _this.handleCodeEditorFontSizeChangeEvent(event);
            });
            this.findElement("#code-editor-tabsize-{{cid}}").change(function(event) {
                _this.handleCodeEditorTabSizeChangeEvent(event);
            });
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Event} event
         */
        handleCodeEditorFontSizeChangeEvent: function(event) {
            event.preventDefault();
            event.stopPropagation();
            var data = {
                setting: "fontSize",
                fontSize: event.target.value
            };
            this.dispatchEvent(new FormViewEvent(FormViewEvent.EventType.CHANGE, data));
        },

        /**
         * @private
         * @param {Event} event
         */
        handleCodeEditorModeChangeEvent: function(event) {
            event.preventDefault();
            event.stopPropagation();
            var data = {
                setting: "mode",
                mode: event.target.value
            };
            this.dispatchEvent(new FormViewEvent(FormViewEvent.EventType.CHANGE, data));
        },

        /**
         * @private
         * @param {Event} event
         */
        handleCodeEditorTabSizeChangeEvent: function(event) {
            event.preventDefault();
            event.stopPropagation();
            var data = {
                setting: "tabSize",
                fontSize: event.target.value
            };
            this.dispatchEvent(new FormViewEvent(FormViewEvent.EventType.CHANGE, data));
        },

        /**
         * @private
         * @param {Event} event
         */
        handleCodeEditorThemeChangeEvent: function(event) {
            event.preventDefault();
            event.stopPropagation();
            var data = {
                setting: "theme",
                theme: event.target.value
            };
            this.dispatchEvent(new FormViewEvent(FormViewEvent.EventType.CHANGE, data));
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.CodeEditorSettingsWidgetView", CodeEditorSettingsWidgetView);
});
