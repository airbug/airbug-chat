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
        '<div id="{{id}}-wrapper" class="code-editor-settings box box-with-header">\
            <div class="box-header">\
            </div>\
            <div class="box-body">' +
//                <table id="{{id}}">\
//                <tr>\
//                  <td >\
//                    <label for="mode">Mode</label>\
//                  </td><td>\
//                    <select id="mode" size="1">\
//                    </select>\
//                  </td>\
//                </tr>\
//                <tr>\
//                  <td>\
//                    <label for="split">Split</label>\
//                  </td><td>\
//                    <select id="split" size="1">\
//                      <option value="none">None</option>\
//                      <option value="below">Below</option>\
//                      <option value="beside">Beside</option>\
//                    </select>\
//                  </td>\
//                </tr>\
//                <tr>\
//                  <td >\
//                    <label for="theme">Theme</label>\
//                  </td><td>\
//                    <select id="theme" size="1">\
//            <optgroup label="Bright">' +
//            //   <option value="ace/theme/chrome">Chrome</option>\
//            //   <option value="ace/theme/clouds">Clouds</option>\
//            //   <option value="ace/theme/crimson_editor">Crimson Editor</option>\
//            //   <option value="ace/theme/dawn">Dawn</option>\
//            //   <option value="ace/theme/dreamweaver">Dreamweaver</option>\
//            //   <option value="ace/theme/eclipse">Eclipse</option>\
//            //   <option value="ace/theme/github">GitHub</option>\
//            //   <option value="ace/theme/solarized_light">Solarized Light</option>' +
//            '<option value="ace/theme/textmate" selected="selected">TextMate</option>' +
//            //   '<option value="ace/theme/tomorrow">Tomorrow</option>\
//            //   <option value="ace/theme/xcode">XCode</option>\
//            // </optgroup>\
//            '<optgroup label="Dark">\
//               <option value="ace/theme/ambiance">Ambiance</option>' +
//            //   <option value="ace/theme/chaos">Chaos</option>\
//            //   <option value="ace/theme/clouds_midnight">Clouds Midnight</option>\
//            //   <option value="ace/theme/cobalt">Cobalt</option>\
//            //   <option value="ace/theme/idle_fingers">idleFingers</option>\
//            //   <option value="ace/theme/kr_theme">krTheme</option>\
//            //   <option value="ace/theme/merbivore">Merbivore</option>\
//            //   <option value="ace/theme/merbivore_soft">Merbivore Soft</option>\
//            //   <option value="ace/theme/mono_industrial">Mono Industrial</option>\
//            //   <option value="ace/theme/monokai">Monokai</option>\
//            //   <option value="ace/theme/pastel_on_dark">Pastel on dark</option>\
//            //   <option value="ace/theme/solarized_dark">Solarized Dark</option>\
//            '<option value="ace/theme/twilight">Twilight</option>' +
//            //   <option value="ace/theme/tomorrow_night">Tomorrow Night</option>\
//            //   <option value="ace/theme/tomorrow_night_blue">Tomorrow Night Blue</option>\
//            //   <option value="ace/theme/tomorrow_night_bright">Tomorrow Night Bright</option>\
//            //   <option value="ace/theme/tomorrow_night_eighties">Tomorrow Night 80s</option>\
//            //   <option value="ace/theme/vibrant_ink">Vibrant Ink</option>\
//            // </optgroup>' +
//            '</select>\
//          </td>\
//        </tr>\
//        <tr>\
//          <td>\
//            <label for="fontsize">Font Size</label>\
//          </td><td>\
//            <select id="fontsize" size="1">\
//              <option value="10px">10px</option>\
//              <option value="11px">11px</option>\
//              <option value="12px" selected="selected">12px</option>\
//              <option value="14px">14px</option>\
//              <option value="16px">16px</option>\
//              <option value="20px">20px</option>\
//              <option value="24px">24px</option>\
//            </select>\
//          </td>\
//        </tr>\
//      </table>\
    '</div>\
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
