//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('CodeEditorSettingsView')

//@Require('Class')
//@Require('airbug.MustacheView')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var MustacheView    = bugpack.require('airbug.MustacheView');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CodeEditorSettingsView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    // table id was controls and more-controls
    template:
        '<div id="{{id}}-wrapper" class="code-editor-settings box">\
            <div class="box-header">\
                Settings\
            </div>\
            <div class="box-body">\
                <table id="{{id}}">\
                <tr>\
                  <td >\
                    <label for="mode">Mode</label>\
                  </td><td>\
                    <select id="mode" size="1">\
                    </select>\
                  </td>\
                </tr>\
                <tr>\
                  <td>\
                    <label for="split">Split</label>\
                  </td><td>\
                    <select id="split" size="1">\
                      <option value="none">None</option>\
                      <option value="below">Below</option>\
                      <option value="beside">Beside</option>\
                    </select>\
                  </td>\
                </tr>\
                <tr>\
                  <td >\
                    <label for="theme">Theme</label>\
                  </td><td>\
                    <select id="theme" size="1">\
            <optgroup label="Bright">' +
            //   <option value="ace/theme/chrome">Chrome</option>\
            //   <option value="ace/theme/clouds">Clouds</option>\
            //   <option value="ace/theme/crimson_editor">Crimson Editor</option>\
            //   <option value="ace/theme/dawn">Dawn</option>\
            //   <option value="ace/theme/dreamweaver">Dreamweaver</option>\
            //   <option value="ace/theme/eclipse">Eclipse</option>\
            //   <option value="ace/theme/github">GitHub</option>\
            //   <option value="ace/theme/solarized_light">Solarized Light</option>' +
            '<option value="ace/theme/textmate" selected="selected">TextMate</option>' +
            //   '<option value="ace/theme/tomorrow">Tomorrow</option>\
            //   <option value="ace/theme/xcode">XCode</option>\
            // </optgroup>\
            '<optgroup label="Dark">\
               <option value="ace/theme/ambiance">Ambiance</option>' +
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
            '<option value="ace/theme/twilight">Twilight</option>' +
            //   <option value="ace/theme/tomorrow_night">Tomorrow Night</option>\
            //   <option value="ace/theme/tomorrow_night_blue">Tomorrow Night Blue</option>\
            //   <option value="ace/theme/tomorrow_night_bright">Tomorrow Night Bright</option>\
            //   <option value="ace/theme/tomorrow_night_eighties">Tomorrow Night 80s</option>\
            //   <option value="ace/theme/vibrant_ink">Vibrant Ink</option>\
            // </optgroup>' +
            '</select>\
          </td>\
        </tr>\
        <tr>\
          <td>\
            <label for="fontsize">Font Size</label>\
          </td><td>\
            <select id="fontsize" size="1">\
              <option value="10px">10px</option>\
              <option value="11px">11px</option>\
              <option value="12px" selected="selected">12px</option>\
              <option value="14px">14px</option>\
              <option value="16px">16px</option>\
              <option value="20px">20px</option>\
              <option value="24px">24px</option>\
            </select>\
          </td>\
        </tr>\
        <tr>\
          <td>\
            <label for="folding">Code Folding</label>\
          </td><td>\
            <select id="folding" size="1">\
              <option value="manual">manual</option>\
              <option value="markbegin" selected="selected">mark begin</option>\
              <option value="markbeginend">mark begin and end</option>\
            </select>\
          </td>\
        </tr>\
        <tr>\
          <td >\
            <label for="keybinding">Key Binding</label>\
          </td><td>\
            <select id="keybinding" size="1">\
              <option value="ace">Ace</option>\
              <option value="vim">Vim</option>\
              <option value="emacs">Emacs</option>\
              <option value="custom">Custom</option>\
            </select>\
          </td>\
        </tr>\
        <tr>\
          <td >\
            <label for="soft_wrap">Soft Wrap</label>\
          </td><td>\
            <select id="soft_wrap" size="1">\
              <option value="off">Off</option>\
              <option value="40">40 Chars</option>\
              <option value="80">80 Chars</option>\
              <option value="free">Free</option>\
            </select>\
          </td>\
        </tr>\
      \
        <tr><td colspan="2">\
            <table id="more-code-editor-settings">\
                <tr>\
                  <td>\
                    <label for="select_style">Full Line Selection</label>\
                  </td><td>\
                    <input type="checkbox" name="select_style" id="select_style" checked>\
                  </td>\
                </tr>\
                <tr>\
                  <td>\
                    <label for="highlight_active">Highlight Active Line</label>\
                  </td><td>\
                    <input type="checkbox" name="highlight_active" id="highlight_active" checked>\
                  </td>\
                </tr>\
                <tr>\
                  <td >\
                    <label for="show_hidden">Show Invisibles</label>\
                  </td><td>\
                    <input type="checkbox" name="show_hidden" id="show_hidden" checked>\
                  </td>\
                </tr>\
                <tr>\
                  <td >\
                    <label for="display_indent_guides">Show Indent Guides</label>\
                  </td><td>\
                    <input type="checkbox" name="display_indent_guides" id="display_indent_guides" checked>\
                  </td>\
                </tr>\
                <tr>\
                  <td >\
                      <label for="show_hscroll">Persistent HScroll</label>\
                      <input type="checkbox" name="show_hscroll" id="show_hscroll">\
                  </td>\
                </tr>\
                <tr>\
                  <td>\
                      <label for="show_vscroll">VScroll</label>\
                    <input type="checkbox" name="show_vscroll" id="show_vscroll">\
                  </td>\
                </tr>' +
                '<tr>\
                  <td >\
                    <label for="animate_scroll">Animate scrolling</label>\
                  </td><td>\
                    <input type="checkbox" name="animate_scroll" id="animate_scroll">\
                  </td>\
                </tr>\
                <tr>\
                  <td >\
                    <label for="show_gutter">Show Gutter</label>\
                  </td><td>\
                    <input type="checkbox" id="show_gutter" checked>\
                  </td>\
                </tr>\
                <tr>\
                  <td >\
                    <label for="show_print_margin">Show Print Margin</label>\
                  </td><td>\
                    <input type="checkbox" id="show_print_margin" checked>\
                  </td>\
                </tr>\
                <tr>\
                  <td >\
                    <label for="soft_tab">Use Soft Tab</label>\
                  </td><td>\
                    <input type="checkbox" id="soft_tab" checked>\
                  </td>\
                </tr>\
                <tr>\
                  <td >\
                    <label for="highlight_selected_word">Highlight selected word</label>\
                  </td>\
                  <td>\
                    <input type="checkbox" id="highlight_selected_word" checked>\
                  </td>\
                </tr>\
                <tr>\
                  <td >\
                    <label for="enable_behaviours">Enable Behaviours</label>\
                  </td>\
                  <td>\
                    <input type="checkbox" id="enable_behaviours">\
                  </td>\
                </tr>\
                <tr>\
                  <td >\
                    <label for="fade_fold_widgets">Fade Fold Widgets</label>\
                  </td>\
                  <td>\
                    <input type="checkbox" id="fade_fold_widgets">\
                  </td>\
                </tr>\
                <tr>\
                  <td >\
                    <label for="elastic_tabstops">Enable Elastic Tabstops</label>\
                  </td>\
                  <td>\
                    <input type="checkbox" id="elastic_tabstops">\
                  </td>\
                </tr>\
                <tr>\
                  <td >\
                    <label for="isearch">Incremental Search</label>\
                  </td>\
                  <td>\
                    <input type="checkbox" id="isearch">\
                  </td>\
                </tr>\
                <tr>\
                  <td >\
                    <label for="highlight_token">Show token info</label>\
                  </td>\
                  <td>\
                    <input type="checkbox" id="highlight_token">\
                  </td>\
                </tr>\
                <tr>\
                  <td >\
                    <label for="read_only">Read-only</label>\
                  </td>\
                  <td>\
                    <input type="checkbox" id="read_only">\
                  </td>\
                </tr>\
                <tr>\
                  <td >\
                    <label for="scrollPastEnd">Scroll Past End</label>\
                  </td>\
                  <td>\
                    <input type="checkbox" id="scrollPastEnd" checked>\
                  </td>\
                </tr>\
                <tr>\
                  <td colspan="2">\
                    <input type="button" value="Edit Snippets" onclick="env.editSnippets()">\
                  </td>\
                </tr>\
            </table>\
        </td></tr>\
    </table>\
    </div>\
    <div class="box-footer">\
    </div>\
</div>',

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data    = this._super();
        data.id     = this.getId() || "code-editor-settings";
        return data;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CodeEditorSettingsView", CodeEditorSettingsView);
