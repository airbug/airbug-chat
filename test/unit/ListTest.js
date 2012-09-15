//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var annotate = require('../../lib/annotate/Annotate').annotate;
var Class = require('../../lib/Class');
var List = require('../../lib/List');
var Obj = require('../../lib/Obj');


//-------------------------------------------------------------------------------
// Declare Test
//-------------------------------------------------------------------------------

var ListTest = {
    /**
     *
     */
    listAddTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var list = new List();


        // Run Test
        //-------------------------------------------------------------------------------

        list.add('value1');
        this.assertEqual(list.getAt(0), 'value1', "Assert first item added to the list is at index 0.");

        list.add('value2');
        this.assertEqual(list.getAt(0), 'value1',
            "Assert first item added to the list is still at index 0 after adding a second item.");
        this.assertEqual(list.getAt(1), 'value2',
            "Assert second item added to the list is at index 1.");


        list.add('value3');
        this.assertEqual(list.getAt(0), 'value1',
            "Assert first item added to the list is still at index 0 after adding a third item.");
        this.assertEqual(list.getAt(1), 'value2',
            "Assert second item added to the list is still at index 1 after adding a third item.");
        this.assertEqual(list.getAt(2), 'value3',
            "Assert third item added to the list is at index 2.");

    }).with('@Test("List add test")'),

    /**
     *
     */
    listContainsTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var list = new List();


        // Run Test
        //-------------------------------------------------------------------------------

        list.add('value1');
        this.assertEqual(list.getAt(0), 'value1', "Assert first item added to the list is at index 0.");
        this.assertEqual(list.contains('value1'), true, "Assert list contains function reports added value is " +
            "contained.");

    }).with('@Test("List contains test")'),

    /**
     *
     */
    listIndexOfFirstTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var list = new List();


        // Run Test
        //-------------------------------------------------------------------------------

        list.add('value1');
        list.add('value2');
        list.add('value3');

        this.assertEqual(list.indexOfFirst('value1'), 0,
            "Assert indexOfFirst item 1 is 0");
        this.assertEqual(list.indexOfFirst('value2'), 1,
            "Assert indexOfFirst item 2 is 1");
        this.assertEqual(list.indexOfFirst('value3'), 2,
            "Assert indexOfFirst item 3 is 2");

        this.assertEqual(list.indexOfFirst('value4'), -1,
            "Assert index of item that hasn't been added to the list is -1");

        // Add the same values again. Assert that the indexOfFirst values are still the same.
        list.add('value1');
        list.add('value2');
        list.add('value3');

        this.assertEqual(list.indexOfFirst('value1'), 0,
            "Assert indexOfFirst item 1 is 0 after adding a duplicate of item 1");
        this.assertEqual(list.indexOfFirst('value2'), 1,
            "Assert indexOfFirst item 2 is 1 after adding a duplicate of item 2");
        this.assertEqual(list.indexOfFirst('value3'), 2,
            "Assert indexOfFirst item 3 is 2 after adding a duplicate of item 3");

    }).with('@Test("List indexOfFirst test")'),

    /**
     *
     */
    listIndexOfLastTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var list = new List();


        // Run Test
        //-------------------------------------------------------------------------------

        list.add('value1');
        list.add('value2');
        list.add('value3');

        this.assertEqual(list.indexOfLast('value1'), 0,
            "Assert indexOfLast item 1 is 0");
        this.assertEqual(list.indexOfLast('value2'), 1,
            "Assert indexOfLast item 2 is 1");
        this.assertEqual(list.indexOfLast('value3'), 2,
            "Assert indexOfLast item 3 is 2");

        this.assertEqual(list.indexOfLast('value4'), -1,
            "Assert index of item that hasn't been added to the list is -1");

        // Add the same values again. Assert that the indexOfLast values have been changed.
        list.add('value1');
        list.add('value2');
        list.add('value3');

        this.assertEqual(list.indexOfLast('value1'), 3,
            "Assert indexOfLast item 1 is 3 after adding a duplicate of item 1");
        this.assertEqual(list.indexOfLast('value2'), 4,
            "Assert indexOfLast item 2 is 4 after adding a duplicate of item 2");
        this.assertEqual(list.indexOfLast('value3'), 5,
            "Assert indexOfLast item 3 is 5 after adding a duplicate of item 3");

    }).with('@Test("List indexOfLast test")'),

    /**
     *
     */
    listRemoveTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var list = new List();


        // Run Test
        //-------------------------------------------------------------------------------

        list.add('value1');
        this.assertEqual(list.getAt(0), 'value1', "Assert item 1 added to the list is at index 0.");

        list.add('value2');
        this.assertEqual(list.getAt(1), 'value2', "Assert item 2 added to the list is at index 1");

        list.add('value3');
        this.assertEqual(list.getAt(2), 'value3', "Assert item 3 added to the list is at index 2");


        list.remove('value4');
        this.assertEqual(list.getCount(), 3,
            "List count has not changed when it tried to remove an item that didn't exist in the list.");
        this.assertEqual(list.getAt(0), 'value1',
            "List still contains item after trying to remove an item that didn't exist.");
        this.assertEqual(list.getAt(1), 'value2',
            "List still contains item after trying to remove an item that didn't exist.");
        this.assertEqual(list.getAt(2), 'value3',
            "List still contains item after trying to remove an item that didn't exist.");

        list.remove('value2');
        this.assertEqual(list.getCount(), 2,
            "List count reports 2 after removing item 2 from list.");
        this.assertEqual(list.getAt(0), 'value1',
            "Assert item 1is at index 0 after removing item 2");
        this.assertEqual(list.getAt(1), 'value3',
            "Assert item 3 is at index 1 after removing item 2");

        list.remove('value1');
        this.assertEqual(list.getCount(), 1,
            "List count reports 1 after removing item 1 from list.");
        this.assertEqual(list.getAt(0), 'value3',
            "Assert item 3 added to the list is at index 0 after removing item 1");

        list.remove('value3');
        this.assertEqual(list.getCount(), 0,
            "List count reports 0 after removing item 3 from list.");

    }).with('@Test("List remove test")'),

    //TODO BRN: Add a removal test that ensures that the FIRST match is removed from the list when removing equal items
    /**
     *
     */
    listRemoveAtTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var list = new List();


        // Run Test
        //-------------------------------------------------------------------------------

        list.add('value1');
        this.assertEqual(list.getAt(0), 'value1',
            "Assert item 1 added to the list is at index 0.");

        list.add('value2');
        this.assertEqual(list.getAt(1), 'value2',
            "Assert item 2 added to the list is at index 1");

        list.add('value3');
        this.assertEqual(list.getAt(2), 'value3',
            "Assert item 3 added to the list is at index 2");


        list.removeAt(1);
        this.assertEqual(list.getAt(0), 'value1', "Assert item 1 is at index 0 after removeAt(1)");
        this.assertEqual(list.getAt(1), 'value3', "Assert item 3 is at index 1 after removeAt(1)");
        this.assertEqual(list.getCount(), 2, "Assert count is 2");

    }).with('@Test("List removeAt test")'),

    /**
     *
     */
    listAddEqualObjectsTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var hashCodeCount = 123;
        var NewClass = Class.extend(Obj, {
            equals: function(value) {
                if (Class.doesExtend(value, NewClass)) {

                    //NOTE BRN: This should always return true for instances of this class

                    return this.getValue() === value.getValue();
                }
            },
            getValue: function() {
                return 123;
            },

            // NOTE BRN: The rules of equality require that equal objects return equal hashcodes

            hashCode: function() {
                return 123;
            }
        });
        var instance1 = new NewClass();
        var instance2  = new NewClass();
        var list = new List();


        // Run Test
        //-------------------------------------------------------------------------------

        list.add(instance1);
        this.assertEqual(list.contains(instance1), true,
            "Assert sanity check that list contains instance1");
        this.assertEqual(list.contains(instance2), true,
            "Assert list contains instance2 since instance1 and instance2 are equal");
        this.assertEqual(list.getCount(), 1,
            "Assert list count is 1 after adding instance1");

        list.add(instance2);
        this.assertEqual(list.contains(instance1), true,
            "Assert that list contains instance1 after adding instance2");
        this.assertEqual(list.contains(instance2), true,
            "Assert that list contains instance2 after adding instance2");
        this.assertEqual(list.getCount(), 2,
            "Assert list count is 2 after adding instance2");

    }).with('@Test("List add equal objects test")'),

    /**
     *
     */
    listAddNonEqualObjectsWithSameHashCodesTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var valueCount = 123;
        var NewClass = Class.extend(Obj, {
            _constructor: function() {
                this.valueCount = valueCount++;
            },
            equals: function(value) {
                if (Class.doesExtend(value, NewClass)) {

                    //NOTE BRN: This should always return false for instances of this class

                    return (this.getValue() === value.getValue());
                }
            },
            getValue: function() {
                return this.valueCount;
            },
            hashCode: function() {
                return 123;
            }
        });
        var instance1 = new NewClass();
        var instance2  = new NewClass();
        var list = new List();


        // Run Test
        //-------------------------------------------------------------------------------

        list.add(instance1);
        this.assertEqual(list.contains(instance1), true,
            "Assert sanity check that list contains instance1");
        this.assertEqual(list.contains(instance2), false,
            "Assert list does not contain instance2 since instance1 and instance2 are not equal");

    }).with('@Test("List add non equal objects that have the same hashCodes test")')

};


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = ListTest;
