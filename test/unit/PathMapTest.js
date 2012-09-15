//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//TODO BRN: We have GOT to figure out a better way of referencing classes. This is crazy.

var annotate = require('../../lib/annotate/Annotate').annotate;
var PathMap = require('../../lib/PathMap');


//-------------------------------------------------------------------------------
// Declare Test
//-------------------------------------------------------------------------------

var PathMapTest = {

    pathMapPutTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var paths = [
            '/',
            '/path1',
            '/path1/path2',
            '/path2',
            '/path2/*'
        ];
        var values = [
            'value1',
            'value2',
            'value3',
            'value4',
            'value5'
        ];

        var pathMap = new PathMap();
        for (var i = 0, size = paths.length; i < size; i++) {
            var path = paths[i];
            var value = values[i];
            pathMap.put(path, value);
        }


        // Run Test
        //-------------------------------------------------------------------------------

        this.assertEqual(pathMap.get('/'), 'value1', "Assert value mapped to base path [/] is correct");
        this.assertEqual(pathMap.get('/path1'), 'value2', "Assert value mapped to path [/path1] is correct");
        this.assertEqual(pathMap.get('/path1/path2'), 'value3', "Assert value mapped to path [/path1/path2] is correct");
        this.assertEqual(pathMap.get('/path2'), 'value4', "Assert value mapped to path [/path2] is correct");
        this.assertEqual(pathMap.get('/path2/wildcard'), 'value5', "Assert value mapped to wild card path [/path1/wildcard] is correct");

        this.assertEqual(pathMap.get('/doesNotExist'), undefined, "Ensure unmapped path returns null");
    }).with('@Test("PathMap put test")')


};


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = PathMapTest;
